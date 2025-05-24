import { connectedUsersInRoomKey } from "@shared/keys/rooms-keys.js"
import { RedisClientType } from "redis"
import { Namespace,} from "socket.io"

export const sendOnlineUsersCount = async(roomId: string, client: RedisClientType, io: Namespace)=>{

    const usersNumber = await client.sCard(connectedUsersInRoomKey(roomId)) //* For the green circle

    io.to(roomId).emit('get-online-users', usersNumber)
    console.log('Sending online users count to room: ', roomId, 'with number: ', usersNumber);

    return
}