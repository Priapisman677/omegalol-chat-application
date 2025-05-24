import { usersInRandomRoom } from "@shared/keys/rooms-keys.js"
import { Socket } from "socket.io"
import { client } from "src/lib/redis-clients.js"

export const onLeaveRoom = async (socket: Socket)=>{

    socket.to(socket.data.matchRoom).emit('stranger-left')
    await client.del(usersInRandomRoom(socket.data.matchRoom))    //* This is handled in "disconnect" but it is handled here to just in case.
    //! I ended up managing to send the socket and user id through direct payload so this KEY doesn't have a purpose.
    return
}