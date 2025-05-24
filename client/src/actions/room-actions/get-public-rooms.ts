"use server"

import { prisma } from "@/lib/db"

export const getPublicRooms = async(): Promise<PublicRoomsActionResponse>=>{
    
    const rooms = await prisma.room.findMany({
        where: {
            isPrivate: false
        },
        take: 20,
        orderBy: {
            roomUser: {
                _count:  'desc'
            }
        },
        select: {
            id: true,
            roomPicPath: true,
            roomName: true,
            _count: {
                select: {
                    roomUser: true
                }
            }
        }
    })
    
    const parsedRooms = rooms.map((room)=>{
        return {
            roomName: room.roomName,
            roomPicPath: room.roomPicPath,
            roomUserCount: room._count.roomUser,
            id: room.id,
            unReadMessages: null
        }
    })
    
    return {
        success: true,
        msg: 'Success',
        rooms: parsedRooms,
    }

}