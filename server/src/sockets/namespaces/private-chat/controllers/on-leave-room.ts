import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys.js';
import { userRoomsKey } from '@shared/keys/user-keys.js';
import { Namespace, Socket } from 'socket.io';
import { client } from 'src/lib/redis-clients.js';
import { sendOnlineUsersCount } from '../utils/shared-sockets.js';
import { RedisClientType } from 'redis';

export const onLeaveRoom = async (socket: Socket, io: Namespace, userId: string,  roomId: string) => {
	

	//- This event gets triggered by useEffect of useChatSocket hook when the roomId changes.
	//! Based on the nature of the useEffect returned function (where leave-room is called), this does not trigger when the client closes their tab so I need to listen for on 'disconnect' similarly to this entire event.

	await Promise.all(
		[
			client.sRem(connectedUsersInRoomKey(roomId), userId!), //* Remove user from the room (room:a (user1, user2))
			client.sRem(userRoomsKey(userId!), roomId), //* Delete room from user  (user:a (room1, room2))
		] 
	);

	await sendOnlineUsersCount(roomId, client as RedisClientType, io); //* For the green circle
	socket.leave(roomId);
	// cb('Successfully left room: ' + roomId);

	return;
};
