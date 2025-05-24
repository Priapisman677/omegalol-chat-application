"use server"

import { prisma } from "@/lib/db";

export const getUserOwningRooms = async(userId: string): Promise<InviteUserOwnRoomActionResponse>=>{

    const rooms = await prisma.room.findMany({
        where: {
            createdById: userId
        },
        select: {
            roomName: true,
            roomPicPath: true,
            id: true
        }
    })


    //! Typescript ignores the nulls, If you want to get rid of the ignore, just SPREAD and insert some null properties.
    //   interface InviteUserOwnRoomActionResponse extends ActionResponse {
        // 	rooms: {
            // 		id: string;
            // 		roomName: string;
            // 		roomPicPath: string | null;
            // 		unReadMessages: null;
            // 		roomUserCount: null
            // 	}[]
            // }
            
            //@ts-ignore
    return {rooms, success: true, msg: 'Rooms fetched successfully'}
}