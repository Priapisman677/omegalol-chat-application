"use server";


import { prisma } from "@/lib/db";

export const getRoomMeta = async (id: string): Promise<RoomMeta | null> => {
    const room = await prisma.room.findFirst({
        where: {
            id,
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    username: true,
                },
            },
            roomUser: {
                select: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profilePicPath: true,

                        },
                    },
                    role: true
                },
            },
        },
    });
    if (!room) return null;

    return {
        id: room.id,
        roomName: room.roomName,
        isPrivate: room.isPrivate,
        roomPicPath: room.roomPicPath,
        createdBy: {
            id: room.createdBy?.id || undefined, //- These are optional on purpose, read why in the schema.prisma.
            username: room.createdBy?.username || undefined, //- Basically, they will allow users to delete their accounts but still all the members of users be able to stay in the room. They can read something like "created by deleted user".
        },
        users: room.roomUser.map((user) => ({
            id: user.user.id,
            username: user.user.username,
            profilePicPath: user.user.profilePicPath,
            role: user.role
        })),
    };
};