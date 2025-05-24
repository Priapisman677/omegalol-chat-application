import { Socket,  Namespace} from 'socket.io';
import { onJoinRoom } from './controllers/on-join-room.js';
import { onSendMessage } from './controllers/on-send-message.js';

														
export const registerSocketHandlers = (socket: Socket, _namespace: Namespace) => {


	//? Advice for invitations in global chat room.

	//$ You could follow a similar approach to random chats, where you need to have the user information, but you would create a Redis JSON with all their users, all their socket IDs, and if available, all their user IDs, and handle invitations from there with the components you already have.





    const roomName = 'global-1'

	
	socket.on('join-room', async (chatIdentifier: string) => {

		onJoinRoom(socket, chatIdentifier, roomName);
	});
    socket.on('send-message', async (payload: ClientPrivateMessage, cb) => {
		await onSendMessage(socket, payload, roomName, cb);
    });
	
	
	socket.on('send-typing', ()=>{
		socket.to(roomName).emit('receive-typing',socket.user?.username || socket.id)
	})
	
	socket.on('send-stop-typing', ()=>{
		socket.to(roomName).emit('receive-stop-typing' ,socket.user?.username || socket.id)
	})
	
	
	socket.emit('ready');
	console.log('ready event sent to', socket.id); 
	

	return;
};
