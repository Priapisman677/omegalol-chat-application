
"use server"

import { prisma } from "@/lib/db";
import { client } from "@/lib/redis-clients";
import { cacheUsersInRoomKey } from "@shared/keys/rooms-keys";
import { headers } from "next/headers";

export const leaveRoom  = async(roomId: string)=>{

    const headerStore = await headers()
    const userId = headerStore.get('userId')

    if(!userId){
        //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
        return { success: false, msg: 'User not found.' };
    }

    const existingRoomUser = await prisma.roomUser.findFirst({
        where: {
            userId,
            roomId
        }
    })

    if (!existingRoomUser) return { success: false, msg: 'You are not in this room.' };

    await prisma.roomUser.delete({
        where: {
            userId_roomId: {
                userId,
                roomId
            }
        }
    })
    
    await client.hDel(cacheUsersInRoomKey(roomId),userId);

    const remainingRoomUsers = await prisma.roomUser.findMany({
        where: {
            roomId
        }
    })
    if(remainingRoomUsers.length === 0){
        await prisma.room.delete({
            where: {
                id: roomId
            }
        })
    }

    return { success: true, msg: 'Success',};
}