"use server"

import { prisma } from "@/lib/db";
import { client } from "@/lib/redis-clients";
import { cacheUsersInRoomKey, connectedUsersInRoomKey } from "@shared/keys/rooms-keys";
import { userRoomsKey } from "@shared/keys/user-keys";
import { headers } from "next/headers";




export const deleteUserFromRoom = async ( userId: string, roomId: string): Promise<{ success: boolean; msg?: string }> => {

    const headerStore = await headers();
    const userIdHeader = headerStore.get('userId');


    if (!userIdHeader) {
        //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
        return { success: false, msg: 'User not found.' };
    }


    const isAdmin = await prisma.roomUser.findFirst({
        where: {
            role: 'admin',
            roomId,
            userId: userIdHeader,
        },
        include: {
            user: {
                select: {
                    username: true, //* This is for the kick event.
                },
            }
        }
    });


    if (!isAdmin) {
        return { success: false, msg: 'Unauthorized, not an admin.' };
    }

    const foundRelation = await prisma.roomUser.findFirst({
        where: {
            userId,
            roomId,
        },
        include: {
            user: {
                select: {
                    username: true, //* This is for the kick event.
                },
            }
        }
    });

    if (!foundRelation) {
        return { success: false, msg: 'User not in room.' };
    }


    //%Even though users cannot see a cross delete themselves, they can still remove themselves technically. They WILL be able to also leave their room itself.


    await prisma.roomUser.delete({
        where: {
            userId_roomId: {
                //$ Prisma uses this to make sure that it is a unique relation I GUESS.
                userId,
                roomId,
            },
        },
    });

    await client.hDel(cacheUsersInRoomKey(roomId), userId);

    
    await client.sRem(connectedUsersInRoomKey(roomId), userId!) //* Remove user from redis room

    await client.sRem(userRoomsKey(userId!), roomId) //* Delete room from user  (user:a (room1, room2))

    await client.publish('kick-user', JSON.stringify({ userId, roomId, kickedBy: isAdmin.user.username, kicking: foundRelation.user.username }));

    return { success: true, msg: 'Success' };
};
