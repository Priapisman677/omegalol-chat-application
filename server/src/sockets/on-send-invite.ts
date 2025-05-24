import { cacheUsersInRoomKey } from "@shared/keys/rooms-keys.js";
import { Socket } from "socket.io";
import { client } from "src/lib/redis-clients.js";

export const onSendInvite = async(socket: Socket, payload: InviteToRoomMessage, receiverRoomOrSocket: string)=>{

    socket.to(receiverRoomOrSocket).emit('receive-room-invite', {roomId: payload.roomId, username: socket.user?.username}) //$ (IF CALLING FROM RANDOM CHATS) If the stranger doesn't have an account invite will be sent anyway, no cache will be set, though.
    if(!payload.strangerInviteInfo?.userId){
        socket.emit('error-event', 'Stranger is not a registered user :(')
        return
    } 
    //* They need to be part of their room cache in case the room is private. Else, when the user clicks on the invitation they will get directed to the room but they will not be able to access it. 
    await client.hSet(cacheUsersInRoomKey(payload.roomId), {[payload.strangerInviteInfo?.userId]: 'invited'}) //$ "Invited will help when the stranger navigates to the room. If the role is invited, "addIdToRoom()" will run."
    return
}