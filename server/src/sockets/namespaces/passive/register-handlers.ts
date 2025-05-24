import { Socket,  Namespace} from 'socket.io';
import { onDisconnect } from './controllers/on-disconnect.js';
import { client } from 'src/lib/redis-clients.js';
import { globalActiveUsersKey } from '@shared/keys/user-keys.js';
import { onSendInvite } from 'src/sockets/on-send-invite.js';


export const registerSocketHandlers = (socket: Socket, namespace: Namespace) => {
	
	//! If you will make a change here remember to make it for unauthenticated users.
	
	const userId = socket.user?.id;
	socket.on('join-room', (userRoomId, cb)=>{

		socket.join('#' + userRoomId)
		cb('Successfully joined room: ' + userRoomId)
	})	

	socket.on('disconnect', async () => {
		await onDisconnect(namespace, socket, userId!);
	});

	socket.on('send-room-invite', async (payload: InviteToRoomMessage)=>{
		console.log('Invite sent')	;
		console.log(payload);

		if(!payload.strangerInviteInfo?.userId){
			console.error('Called passive invite without user id');
			return
		}

		//* The user you want to invite might have a lot of active passive sockets.
		const invitingActivePassiveSockets = await client.sMembers(globalActiveUsersKey("#" + payload.strangerInviteInfo?.userId))

		console.log(invitingActivePassiveSockets);

		invitingActivePassiveSockets.forEach((ActivePassiveSocket)=>{
			onSendInvite(socket, payload, ActivePassiveSocket)
		})
		
	})


	socket.emit('ready');

	return;
};
