import { searchUsersRedis } from '@/actions/redis-actions/search-users';
import { prisma } from '@/lib/db';
import { client } from '@/lib/redis-clients';
import { userJSONkey } from '@shared/keys/user-keys';
import '@testing-library/jest-dom';

const getMock = jest.fn();
const userId = '#AK6L227D';

jest.mock('next/headers', () => {
	return {
		__esModule: true,
		headers: () => {
			return { get: getMock };
		},
	};
});


beforeAll( async ()=>{
	// await new Promise((r) => setTimeout(r, 1000));//! This might help avoid parallelism issues between tests, especially the ones that depend on Prisma.
	
	await prisma.user.deleteMany({}) //! Important because it might conflict with other tests such as addIdtoRoom.test.ts
})

beforeEach(() => {
	jest.restoreAllMocks();
	getMock.mockReturnValue({ userId });
});

afterEach(() => {
});

const mockUsers = [
    { userId: 'abc', username: 'userAmike' },
    { userId: 'def', username: 'userBdwati' },
    { userId: 'ghi', username: 'userConstructor' },
];

beforeAll(async () => {
    for (const user of mockUsers) {
        await client.del(userJSONkey('#' + user.userId));
    }
})




test('Try to get userId.', async () => {
	const result = await searchUsersRedis('lol');

	expect(getMock).toHaveBeenCalledWith('userId');

	expect(result.success).not.toBeNull();
});

test('If no userId is found, warn.', async () => {
	getMock.mockReturnValue(null);

	const result = await searchUsersRedis('lol');

	expect(getMock).toHaveBeenCalledWith('userId');

	expect(result.success).toBe(false);
	expect(result.msg).toBe('No userId found.');
});

//% Rate limiter has its own test.

test('If user passes an empty string or a "#", return an empty object', async () => {
	const result1 = await searchUsersRedis('');
	const result2 = await searchUsersRedis('#ABC');

	expect(result1.foundUsers).toEqual([]);
	expect(result2.foundUsers).toEqual([]);
});

test('"cleanedArray" logs the correct values"', async () => {
	const spy = jest.spyOn(global.console, 'log');

	await searchUsersRedis('a!b@c# d$e');

	expect(spy).toHaveBeenCalledWith({ cleanedArray: ['abc#', 'de'] });

	await searchUsersRedis('#abcde');

	expect(spy).toHaveBeenCalledWith({ cleanedArray: ['#abcde'] });

	spy.mockRestore(); // prevent leaks
});

test('"query" logs the correct values"', async () => {
	const spy = jest.spyOn(global.console, 'log');

	await searchUsersRedis('a!b@c# d$e');

	expect(spy).toHaveBeenCalledWith({ query: '@username:(%abc% | %de%)' });
	expect(spy).toHaveBeenCalledWith({ query: '@username:(*abc* | *de*)' });

	await searchUsersRedis('#abcde');

	expect(spy).toHaveBeenCalledWith({ query: '@userId:{abcde}' });

	spy.mockRestore(); // prevent leaks
});

test('Should return the correct results', async () => {
	for (const user of mockUsers) {
		await client.json.set(userJSONkey(`#${user.userId}`), '$', {
			userId: user.userId,
			data: {
				username: user.username,
			},
		});
	}
    const results = await searchUsersRedis('user')

    expect(results.foundUsers).toHaveLength(3)

    expect(results.foundUsers![0]).toEqual({
        userId: '#ghi',
        username: 'userConstructor',
        data: {
            username: 'userConstructor',
        }
    })
});
