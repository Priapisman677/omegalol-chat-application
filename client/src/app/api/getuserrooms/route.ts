import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import {headers} from 'next/headers'

export async function GET() {
    
    const headerStore = await headers()
    const userId = headerStore.get('userId')

    if(!userId){
        //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
        return NextResponse.json({ success: false, msg: 'User not found.' });
    }
    
    //? I might want to not include many things here.
    const rooms = await prisma.roomUser.findMany({
        where: {
            userId
        },
        orderBy: {
            room: {
                createdAt: 'desc'
            }
        },
        select: {
            //! If you want to add some if you want to add something here remember to put it into the structured object returned.
            role: true,
            unReadMessages: true,
            room: {
                select: {
                    roomName:  true,
                    id: true,
                    isPrivate: true,
                    roomPicPath: true,
                    createdAt: true,
                    createdBy: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    messages: {
                        select: {
                            timestamp: true
                        },
                        take: 1,
                        orderBy: {
                            timestamp: 'desc'
                        }
                    }
                }
            }
        }
    })

    
    const parsedRooms = rooms.map((room)=>{
        return {
            role: room.role,
            unReadMessages: room.unReadMessages,
            ...room.room
        }
    })

    //// Apparently this is not used for sorting the user rooms in order of time stamps of messages. It seems like ordering the results from postgres by messages timestamps already sorts the full thing.
    //? Wait, what??

    //* They do need to be sorted with this function, it is just not necessary to send the sorted rooms, you could send the parsed rooms and they are mutated. But, obviously, just send "sortedRooms".


    //$ Sort the rooms by the time of the last message. If there are no messages, sort by the creation time.
    const sortedRooms = parsedRooms.sort((a, b) => {
        const aTime = a.messages[0]?.timestamp ?? a.createdAt;
        const bTime = b.messages[0]?.timestamp ?? b.createdAt;
        return bTime.getTime() - aTime.getTime();
    });

    return NextResponse.json({ success: true, msg: 'Success' , rooms: sortedRooms});
}