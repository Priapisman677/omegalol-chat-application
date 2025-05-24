"use server"

import { prisma } from '@/lib/db';
import { client } from '@/lib/redis-clients';
import { deleteSession } from '@/lib/session';
import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys';
import { userRoomsKey } from '@shared/keys/user-keys';
import bcryptjs from 'bcryptjs';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

//prettier-ignore
export const deleteAccount = async (password: string): Promise<ActionResponse> => {
	const headerStore = await headers();

	const userId = headerStore.get('userId');

	if (!userId) {
		//! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
		return { success: false, msg: 'User not found.' };
	}

    const user = await prisma.user.findFirst({
        where: {id: userId}
    })

    if (!user) return { success: false, msg: 'User not found.' };

    const isValid = await bcryptjs.compare(password, user.hash)

    if (!isValid) return { success: false, msg: 'Invalid password' };

	await prisma.user.delete({
		where: {id: userId,},
	});

	const rooms = await client.sMembers(userRoomsKey(userId));

	await Promise.all([
		...rooms.map(async (roomId) => {
			client.sRem(connectedUsersInRoomKey(roomId), userId!); //* Remove user from the room (room:a (user1, user2))
			// await sendOnlineUsersCount(roomId, client as RedisClientType, io) //* For the green circle
		}),
		client.del(userRoomsKey(userId)),
	]);

    await deleteSession()

	// return { msg: 'Success', success: true } as ActionResponse;

    redirect('/signup');

};
