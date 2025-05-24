"use server";

import { prisma } from "@/lib/db";
import { verifyIsRoomUserOrCache } from "./verify-is-roomUser-or-cache";
import { headers } from "next/headers";

export const getRoomMessages = async (roomId: string, limit?: number): Promise<GetRoomMessagesActionResponse> => {


    if(roomId !== 'GLOBAL'){ //$ If roomId is not global, check if the user is in the room.
        
            const headerStore = await headers();
            const userId = headerStore.get('userId');
            if (!userId) {
                return { success: false, msg: 'User not found.', messages: []};
            }
        
            const isRoomUser = await verifyIsRoomUserOrCache(userId, roomId)
        
            if (!isRoomUser.role) {
                return { success: false, msg: 'You are not in this room.', messages: [] };
            }

    }


    const rawMessages = await prisma.message.findMany({
        where: { roomId },
        orderBy: { timestamp: 'desc' },
        take: limit, //$ if undefined, will return all.
        include: {
            user: { select: { username: true, profilePicPath: true, gender: true, country: true } },
        },
    });

    const messages: ClientPrivateMessage[] = rawMessages.map((msg) => {
        if (msg.messageType === 'text') {
            return {
                id: msg.id,
                username: msg.user.username,
                profilePicPath: msg.user.profilePicPath,
                roomId: msg.roomId,
                userId: msg.userId,
                timeStamp: msg.timestamp,
                messageType: 'text',
                textContent: msg.textContent ?? '',
                identifier: msg.identifier,
                countryCode: msg.user?.country || null,
                gender: msg.user?.gender || null
            }as ClientPrivateTextMessage;
        } else if (msg.messageType === 'file') {
            return {
                id: msg.id,
                username: msg.user.username,
                profilePicPath: msg.user.profilePicPath,
                roomId: msg.roomId,
                userId: msg.userId,
                timeStamp: msg.timestamp,
                messageType: 'file',
                fileName: msg.fileName ?? '',
                fileUrl: msg.fileUrl ?? '',
                mimeType: msg.mimeType ?? undefined,
                fileSize: msg.size ?? undefined,
                identifier: msg.identifier,
                bytes: msg.bytes || null,
                countryCode: msg.user?.country || null,
                gender: msg.user?.gender || null
            } as ClientPrivateFileMessageWhenReceived;
        } else{ //* If messageType is 'event'
            return {
                messageType: 'event',
                textContent: msg.textContent,
                timeStamp: msg.timestamp,
                username: msg.user.username,

            } as EventMessage

        }
    });

    return { success: true, messages, msg: 'Success' };
};