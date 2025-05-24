import { Namespace, Socket } from "socket.io"
import { sendAndSaveEvent } from "src/sockets/send-event.js"

export const onLeaveRoomForever = async (socket: Socket, namespace: Namespace, roomId: string)=>{

    await sendAndSaveEvent(namespace, 'red', roomId, socket.user?.username + ' left.')
    
    return
}