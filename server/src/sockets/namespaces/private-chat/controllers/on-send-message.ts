import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys.js';
import { Socket } from 'socket.io';
import { prisma } from 'src/lib/db.js';
import { client } from 'src/lib/redis-clients.js';
import { saveTextMessage } from 'src/lib/save-text-messages.js';

export const onSendMessage = async (socket: Socket, payload: ClientPrivateMessage, userId: string) => {


	if (payload.messageType === 'file') {
		//* File gets  saved in Next,  I will not send the bytes using sockets lol.
	} else if (payload.messageType === 'text') {
		const result = await saveTextMessage(payload as ClientPrivateTextMessage, userId!);

		console.log({result});
		


		if(!result.success) return socket.emit('error-event', result.msg);

	} else {
		socket.emit('error-event', { error: 'Invalid content Type' });
		return;
	}

	// const isReceiverInRoom = await client.sIsMember(connectedUsersInRoomKey(payload.roomId), socket.id)
	// if(!isReceiverInRoom){
	// 	await prisma.roomUser.update({
	// 		where: {
	// 			userId_roomId: {
	// 				userId,
	// 				roomId: payload.roomId
	// 			}
	// 		},
	// 		data: {
	// 			unReadMessages :{
	// 				increment: 1
	// 			}
	// 		}
	// 	})
	// }

	const usersInRoom = await prisma.roomUser.findMany({
		where: {
			roomId : payload.roomId,
		},
		select: {
			user: {
				select: {
					id: true,
				}
			}
		}
	})

	const usersInRoomIds = usersInRoom.map((user) => user.user.id)

	const usersInRoomSocketIds = await client.sMembers(connectedUsersInRoomKey(payload.roomId))

	for(const userId of usersInRoomIds){

		if(!usersInRoomSocketIds.includes(userId)){
			await prisma.roomUser.update({
				where: {
					userId_roomId: {
						userId,
						roomId: payload.roomId
					}
				},
				data: {
					unReadMessages :{
						increment: 1
					}
				}
			})
		}

	}
	
	


	socket.broadcast
		.to(payload.roomId)
		.emit('receive-message', { ...payload });

	return;
};
