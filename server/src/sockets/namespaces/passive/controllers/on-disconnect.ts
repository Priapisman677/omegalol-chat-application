import { globalActiveUsersKey } from '@shared/keys/user-keys.js';
import { Namespace, Socket } from 'socket.io';
import { client } from 'src/lib/redis-clients.js';
import { sendGlobalSocketsCount } from '../send-global-sockets-count.js';

export const onDisconnect = async (namespace: Namespace, socket: Socket, userId: string) => {

	//! If you will make a change here remember to make it for unauthenticated users.

    
    await client.sRem(globalActiveUsersKey(socket?.user?.id!), socket.id) 
    const exists = await client.exists(globalActiveUsersKey(socket?.user?.id!))
    
    if(!exists) socket.to(userId).emit('status-update', false)

    await sendGlobalSocketsCount(socket, namespace, 'remove')

	return;
};
