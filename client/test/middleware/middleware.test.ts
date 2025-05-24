import { prisma } from '@/lib/db';
import { createServer } from 'http';
import next from 'next';
import supertest from 'supertest';
import { beforeAll, afterAll, test, expect } from 'vitest';

const app = next({ dev: true, dir: './' });
const handle = app.getRequestHandler();
const fakeCookieUser =
	'SERVER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIjWjc2N0UxQkFMViIsImV4cGlyZXNBdCI6IjIwMjUtMDUtMjBUMDE6NDE6MDIuNzE3WiIsImlhdCI6MTc0NzEwMDQ2MiwiZXhwIjoxNzQ3NzA1MjYyfQ.o88EcgSDIzta6cZYw_UVk_A0RE_Eie-bxd9EXKLKzjs'; //! This cookie will also be used for socket connections (same prisma user too (#Z767E1BALV))
	//! Remember that this expire, they must be replaced every seven days.
const userId = '#Z767E1BALV';

let server: ReturnType<typeof createServer>;

beforeAll(async () => {
	await prisma.user.upsert({
		create: {
			username: 'test',
			email: 'test',
			hash: 'test',
			id: userId, //! It needs to be this ID so that it matches with the cookie.
		},
		update: {},
		where: {
			id: userId,
		},
	});

	await app.prepare();
	server = createServer((req, res) => handle(req, res));
	await new Promise<void>((resolve) => {
		server.listen(5123, () => resolve());
	});
}, 15000);

afterAll(() => {
	server.close();
});

test('redirects unauthenticated user from protected route', async () => {
	const res = await supertest(server)
		.get('/chat') // goes through your middleware
		.set('Cookie', ''); // no auth cookie

	expect(res.status).toBe(307);
	expect(res.headers.location).toBe('/signup');
}, 15000);

test('If authenticated, does not redirect', async () => {
	const res = await supertest(server)
		.get('/chat') // goes through your middleware
		.set('Cookie', fakeCookieUser);
	//- This cookie when decoded will look like:
	//{userId: '#EBHTL22O9E', expir: '2025- SOME DATE....', iat: '2025- SOME DATE....'}

	expect(res.status).toBe(200);
}, 22000);

test('If authenticated, set a header with the user id', async () => {
	const res = await supertest(server)
		.get('/chat/top') // goes through your middleware
		.set('Cookie', fakeCookieUser);

	//$ Idk why header names must be lowercase even though they are set in UPPERCASE.
	expect(res.headers['userid']).toBe('#Z767E1BALV');
		//¡ Remember that this expire, they must be replaced every seven days.

}, 22000);

test('If authenticated, redirect from /signup to /', async () => {
	const res = await supertest(server)
		.get('/signup')
		.set('Cookie', fakeCookieUser);
	expect(res.status).toBe(307);
	expect(res.headers.location).toBe('/');
}, 22000);
