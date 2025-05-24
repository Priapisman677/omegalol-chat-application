import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys.js';
import { activeSocketPrivateTab, userRoomsKey } from '@shared/keys/user-keys.js';
import { Namespace, Socket } from 'socket.io';
import { client } from 'src/lib/redis-clients.js';
import { sendOnlineUsersCount } from '../utils/shared-sockets.js';
import { RedisClientType } from 'redis';

export const onDisconnect = async (namespace: Namespace, socket: Socket, userId: string) => {
	// console.log(socket.rooms); //! This gives an empty array on 'disconnect' So need to remove them manually.
    
    const oldSocketId =  socket.id
    
    const newActiveSocketId = await client.get(activeSocketPrivateTab(userId)) //! If the disconnection was caused because of a duplicate tab don't run the logic for disconnection-

    if(newActiveSocketId !== oldSocketId) return 
	
	const userRooms = await client.sMembers(userRoomsKey(userId!));
	
	//* This mimics the 'leave-room' event but without access to the roomId.
	await Promise.all([
		...userRooms.map(async (roomId) => {
			client.sRem(connectedUsersInRoomKey(roomId), userId!); //* Remove user from the room (room:a (user1, user2))
			await sendOnlineUsersCount(roomId,client as RedisClientType, namespace); //* For the green circle
		}),
		client.del(userRoomsKey(userId!)), //* Delete list of rooms user is in (user:a (room1, room2))
		client.del(activeSocketPrivateTab(socket.user!.id)) //* Remove old active socket string
	]);

	return;
};
