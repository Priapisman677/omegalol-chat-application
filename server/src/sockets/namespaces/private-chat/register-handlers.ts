import { Socket,  Namespace, Server } from 'socket.io';

import { onSendMessage } from './controllers/on-send-message.js';
import { onJoinRoom } from './controllers/on-join-room.js';
import { onDisconnect } from './controllers/on-disconnect.js';
import { onLeaveRoom } from './controllers/on-leave-room.js';
import { onLeaveRoomForever } from './controllers/on-leave-room-forever.js';


																//* I left io unused on purpose.
export const registerSocketHandlers = (socket: Socket, namespace: Namespace, _io: Server) => {

	const userId = socket.user?.id;
	socket.on('send-message', (payload: ClientPrivateMessage) => {

		onSendMessage(socket, payload, userId!);
	});

	socket.on('join-room', async (roomId: string, cb) => {
		await onJoinRoom(socket, namespace, userId!, roomId, cb);
	});

	socket.on('leave-room', async (roomId: string) => {
		await onLeaveRoom(socket, namespace, userId!, roomId);
	});

	socket.on('disconnect', async () => {
		await onDisconnect(namespace, socket, userId!);
	});

	socket.on('leave-room-forever', async (roomId: string)=>{
		onLeaveRoomForever(socket, namespace, roomId)
		await onLeaveRoom(socket, namespace, userId!, roomId)  // *Ideally this happens automatically on the useChatSocket cleanup.
	})

	socket.on('send-typing', (roomId: string)=>{
		socket.to(roomId).emit('receive-typing',socket!.user!.username)
	})

	socket.on('send-stop-typing', (roomId: string)=>{
		socket.to(roomId).emit('receive-stop-typing' ,socket!.user!.username)
		
	})


	socket.emit('ready');

	return;
};
