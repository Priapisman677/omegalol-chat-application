import { activeSocketPrivateTab } from "@shared/keys/user-keys.js"
import { RedisClientType } from "redis"
import { Namespace } from "socket.io"
import { sendOnlineUsersCount } from "../utils/shared-sockets.js"
import { sendAndSaveEvent } from "src/sockets/send-event.js"

export const onKick  = async(namespace: Namespace, client: RedisClientType, msg: string)=>{
    const {userId, roomId, kickedBy, kicking} = JSON.parse(msg)

    const socketId = await client.get(activeSocketPrivateTab(userId))

    if(!socketId) return

    namespace.to(socketId).emit('kick-out', roomId)
    
    namespace.to(socketId).socketsLeave(roomId)

    await sendAndSaveEvent(namespace, 'red', roomId, `${kicking} was kicked by ${kickedBy}`)
    
    await sendOnlineUsersCount(roomId, client as RedisClientType, namespace); //* For the green circle
}