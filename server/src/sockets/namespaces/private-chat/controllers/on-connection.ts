import { Namespace,  Server,  Socket } from "socket.io"
import { client } from "src/lib/redis-clients.js"
import { activeSocketPrivateTab } from "@shared/keys/user-keys.js"
import { registerSocketHandlers } from "../register-handlers.js"

export const onConnection = async (socket: Socket, namespace: Namespace, io: Server)=>{
		console.log( 'Connection attempt to /private from', socket.request.connection.remoteAddress);
    if(!socket.user){
        //! This should never happen.
        socket.emit('error-event', {error: 'FAILED TO AUTHENTICATE, PLEASE SIGN IN.'}) 
        return
    }
	
	//* This below will ALWAYS be true, unless it's the first connection of the user. It will always ONLY disconnect the old socket and register the new one. The new one will NOT be deleted on disconnection, that causes bugs because we try to set the active socket again here.
	const result = await client.get(activeSocketPrivateTab(socket.user.id))
	

	//! The following line needs to be placed exactly there. right after getting the result and right before sending the disconnection event
	await client.set(activeSocketPrivateTab(socket.user.id), socket.id) //* To fire disconnection, never gets deleted 
	//! if you place it before getting the result obviously the result will be the new socket and you'll disconnect the new socket.
	//! If you place it after sending the disconnection to the old socket ("result"), this:
			// const newActiveSocketId = await client.get(activeSocketPrivateTab(userId))
	//! Will point to the old socket id

	if(result){
		socket.to(result).emit('prevent-duplicate-connection', {
		msg: 'Another tab is already open. This tab will be closed.'
		},)
		
		namespace.sockets.get(result)?.disconnect() //* This also triggers the 'disconnect' local event.
	} 
	

    registerSocketHandlers(socket, namespace, io)
    return
}