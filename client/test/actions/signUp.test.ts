import { signUp } from '@/actions/user-actions/sign-up';
import { prisma } from '@/lib/db';
import { client } from '@/lib/redis-clients';
import { userJSONkey } from '@shared/keys/user-keys';

let email = 'john.doe@example.com';
let id = 'YYR2VQJ21';

jest.mock('nanoid', () => ({
	customAlphabet: () => () => id,
}));

beforeEach(async () => {
	//¡ Make Prisma a DOCKER connection. 🐋🐋🐋🐋🐋🐋🐋🐋

	try {
		await prisma.user.deleteMany({
			where: {
				email,
			},
		});
	} catch (e) {
		console.log(
			'Error at signup.test.ts (deleteMany), please log the error manually'
		);
	}

    await client.json.del(userJSONkey('#' + id))
});

const setMock = jest.fn();

jest.mock('next/headers', () => {
	return {
		__esModule: true,
		cookies: () => {
			return {
				set: setMock,
			};
		},
	};
});

test('Should create a user', async () => {
	const res: SignUpActionResponse = await signUp({
		username: 'john_doe',
		email,
		password: '12345678',
	});
	expect(res).toEqual({
		success: true,
		msg: 'User created',
		user: { username: 'john_doe', email, id: '#' + id, profilePicPath: null, country: null, gender:'unknown', bio: null },
	});

	const user = await prisma.user.findFirst({
		where: { email: 'john.doe@example.com' },
	});
	expect(user).toBeTruthy();
	expect(user?.username).toBe('john_doe');
});

test('Should set cookie upon successful sign up', async () => {
	await signUp({
		username: 'john_doe',
		email,
		password: '12345678',
	});

    //prettier-ignore
	expect(setMock).toHaveBeenCalledWith(
		'SERVER_TOKEN',
		expect.any(String),
		expect.objectContaining({ httpOnly: true,expires: expect.any(Date)})
	);
	//$ what you're seeing is specific to toHaveBeenCalledWith() (and other Jest matchers like toHaveBeenLastCalledWith, toHaveBeenNthCalledWith, etc.).

	//$ Asserting that the setMock function was called

	//$ With 3 arguments:

	//$ A string literal 'SERVER_TOKEN'

	//$ Anything that’s a String

	//$ An object that includes at least httpOnly: true and expires as a Date
});

test('Should setup Redis JSON', async ()=>{
    await signUp({
		username: 'john_doe',
		email,
		password: '12345678',
	});

    const redisJSON = await client.json.get(userJSONkey('#' + id))

    expect(redisJSON).toEqual({ userId: 'YYR2VQJ21', data: { username: 'john_doe', profilePicPath: null } })
})



//? Maybe test NO-redis too
it('should reject invalid data and not set any cookie', async () => {
	const res: SignUpActionResponse = await signUp({
		username: '',
		email: 'nope',
		password: '123',
	});
	expect(res.success).toBe(false);
	expect(setMock).not.toHaveBeenCalled();

	expect(res.msg).toBe('Username must be at least 1 character.');
	const user = await prisma.user.findFirst({ where: { email: 'nope' } });
	expect(user).toBeNull();
});
