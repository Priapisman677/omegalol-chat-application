import { Namespace,  Socket } from "socket.io"
import { sendOnlineUsersCount } from "../utils/shared-sockets.js"
import { client } from "src/lib/redis-clients.js"
import { RedisClientType } from "redis"
import { cacheUsersInRoomKey, connectedUsersInRoomKey } from "@shared/keys/rooms-keys.js"
import { userRoomsKey } from "@shared/keys/user-keys.js"
import { prisma } from "src/lib/db.js"




//prettier-ignore
export const onJoinRoom = async(socket: Socket, io: Namespace, userId: string,  roomId: string, cb: (message: string)=>void)=>{


    //* CHECKING CACHE for validation
    const role = (await client.hGet(cacheUsersInRoomKey(roomId), userId)) as | 'admin' | 'member'| null;
    if(!role){
        const isMemberPrisma = await prisma.roomUser.findFirst({
            where: {
                userId,
                roomId
            }
        })

        console.log({role});
        

        if(isMemberPrisma){
            await client.hSet(cacheUsersInRoomKey(roomId), {[userId]: isMemberPrisma.role}) 
        }else{
            cb('You are not allowed to join this room')
            return
        }
    }

    await Promise.all([
        client.sAdd(connectedUsersInRoomKey(roomId), userId!), //* Add user to the room (room:a (user1, user2))
        client.sAdd(userRoomsKey(userId!), roomId) //* Add to room to the user  (user:a (room1, room2))
    ])

    socket.join(roomId)

    await sendOnlineUsersCount(roomId, client as RedisClientType, io) //* For the green circle

    cb('Successfully joined room: ' + roomId)

    return
}