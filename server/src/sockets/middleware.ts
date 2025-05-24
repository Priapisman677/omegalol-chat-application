
import * as cookie from 'cookie'; // ✅ Works in ESM+Jest

import { Socket } from 'socket.io';
import { prisma } from 'src/lib/db.js';
import { verifyToken } from 'src/lib/tokens.js';

export const middleWare = async ( socket: Socket, next: (err?: Error) => void) => {
	//- Most of the logic of authentication for sockets will not be used because to use sockets as a page requires authentication itself.
	//- It is just an extra paranoic security measure in case someone tries to connect to the socket from outside the frontend lol.

	//$ io.use((socket, next) => { ... }) is a connection-level middleware.
	//$ It runs before the connection event is fired.

	const rawCookie = socket.handshake.headers.cookie || '';
	const parsedCookies = cookie.parse(rawCookie);

	//- I don't call this cookie because I'm already importing something called cookie.
	const token = parsedCookies['SERVER_TOKEN'];
	if (!token) {
		console.log('Cookie not found at sockets-setup.ts.');

		socket.user = null;

		next();
		return;
	}

	const decoded = verifyToken(token);

	if (!decoded) {
		console.log('Invalid jwt token at sockets-setup.');

		socket.user = null;
		next();
		return;
	}

	const user = await prisma.user.findFirst({
		where: { id: decoded },
		select: {
			email: true,
			id: true,
			username: true,
		},
	});

	if (!user) {
		console.log('User not found at sockets-setup.ts.');

		socket.user = null;
		next();
		return;
	}
	
	socket.user = user;

	next();
};
