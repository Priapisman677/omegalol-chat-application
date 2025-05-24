import { Socket } from "socket.io"
import { onStopSearch } from "./on-stop-searcht.js"
import { client } from "src/lib/redis-clients.js"
import { usersInRandomRoom } from "@shared/keys/rooms-keys.js"

export const onDisconnect = async(socket: Socket)=>{

    socket.to(socket.data.matchRoom).emit('stranger-left')
    await onStopSearch(socket) //- Just reusing another controller.

    await client.del(usersInRandomRoom(socket.data.matchRoom))    //* This is handled in leave-room but it is handled here to just in case.
    //! I ended up managing to send the socket and user id through direct payload so this KEY doesn't have a purpose.
    return
}