import { deleteAccount } from '@/actions/user-actions/delete-account';
import { prisma } from '@/lib/db';
import { client } from '@/lib/redis-clients';
import { userRoomsKey } from '@shared/keys/user-keys';
import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys';
import bcryptjs from 'bcryptjs';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';
const userId = 'user123';
const password = 'mySecret123';
let hash: string;
const roomId = 'roomABC';

const getMock = jest.fn();
jest.mock('next/headers', () => ({
	__esModule: true,
	headers: () => ({
		get: getMock,
	}),
}));

jest.mock('next/navigation', () => ({
	__esModule: true,
	redirect: jest.fn(),
}));

jest.mock('@/lib/session', () => ({
	deleteSession: jest.fn(),
}));

beforeAll(async () => {
    hash = await bcryptjs.hash(password, 10);
	await prisma.user.upsert({
		create: {
			id: userId,
			email: 'test@example.com',
			username: 'testuser',
			hash,
		},
        update: {},
        where: { id: userId },
	});

	await client.sAdd(userRoomsKey(userId), roomId);
	await client.sAdd(connectedUsersInRoomKey(roomId), userId);
});

afterAll(async () => {
	await prisma.user.deleteMany({});
	await client.del(userRoomsKey(userId));
	await client.del(connectedUsersInRoomKey(roomId));
});

test('Should delete account, clear Redis, and redirect', async () => {
	getMock.mockReturnValue(userId);

	await deleteAccount(password);

	const user = await prisma.user.findFirst({ where: { id: userId } });
	expect(user).toBeNull();

	const userRooms = await client.sMembers(userRoomsKey(userId));
	expect(userRooms).toEqual([]);

	const connected = await client.sMembers(connectedUsersInRoomKey(roomId));
	expect(connected).not.toContain(userId);

	// Mocked redirect call
	expect(redirect).toHaveBeenCalledWith('/signup');

	expect(deleteSession).toHaveBeenCalled();
});

test('Should fail with wrong password', async () => {
	await prisma.user.create({
		data: {
			id: userId,
			email: 'wrongpass@example.com',
			username: 'wrongpass',
			hash,
		},
	});
	getMock.mockReturnValue(userId);

	const res = await deleteAccount('wrongpassword');
	expect(res).toEqual({ success: false, msg: 'Invalid password' });

	// Make sure user wasn't deleted
	const user = await prisma.user.findFirst({ where: { id: userId } });
	expect(user).not.toBeNull();
});

test('Should return error if no userId in headers', async () => {
	getMock.mockReturnValue(null);

	const res = await deleteAccount(password);
	expect(res).toEqual({ success: false, msg: 'User not found.' });
});
