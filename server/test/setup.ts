
import { beforeAll, beforeEach} from 'vitest';
import { client } from 'src/lib/redis-clients.js';
import { server } from '../src/sockets-setup.js';
import { prisma } from 'src/lib/db.js';
import { Socket } from 'socket.io';
import { io as Client, } from 'socket.io-client';
import { validCookie1 } from './user-tokens.js';

//! ENV loaded in vitest.config.ts



export const userId1 = '#Z767E1BALV';
export const userId2 = '#B97LRKGHS3';
const roomName = 'backroom';
export const roomId: string = 'backroom';
export let clientSocketA: Socket;



beforeAll(async () => {

	await client.flushAll()

	await new Promise<void>((resolve) => {
		server.listen(5000, () => {
			resolve();
		});
	});

	await prisma.user.deleteMany();

	await prisma.user.upsert({
		create: {
			username: 'test1',
			email: 'test1',
			hash: 'test1',
			id: userId1, //! It needs to be this ID so that it matches with the cookie.
		},
		update: {},
		where: {
			id: userId1,
		},
	});

	await prisma.user.upsert({
		create: {
			username: 'test2',
			email: 'test2',
			hash: 'test2',
			id: userId2, //! It needs to be this ID so that it matches with the cookie.
		},
		update: {},
		where: {
			id: userId2,
		},
	});

	await prisma.room.upsert({ //% These are needed for the Redis caching.
		create: {
			isPrivate: false,
			roomName,
			id: roomId,
		},
		update: {},
		where: { id: roomId },
	});

	await prisma.roomUser.createMany({  //% These are needed for the Redis caching.
		data: [
			{
				roomId,
				userId: userId1,
				role: 'admin',
			},
			{
				roomId,
				userId: userId2,
				role: 'member',
			},
		],
	});
	


	// create user and JWT
    //@ts-ignore
	clientSocketA = Client('http://localhost:5000/private', {
		extraHeaders: {
			Cookie: validCookie1,
		},
		transports: ['websocket'], // avoid polling issues
	});

	await new Promise<void>((resolve, reject) => {
		clientSocketA.on('connect', resolve);
		clientSocketA.on('connect_error', reject);
	});

});

beforeEach(async () => {
	await prisma.message.deleteMany({});
});