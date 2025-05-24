import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET as string;

export const createSession = async (userId: string) => {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	// prettier-ignore
	const token = jwt.sign({ userId, expiresAt }, secret, {
		algorithm: 'HS256',
		expiresIn: '7d',
	});

	const cookieStore = await cookies();
	cookieStore.set('SERVER_TOKEN', token, {
		httpOnly: true, //$ Prevent JavaScript access in the browser.
		expires: expiresAt,
		// secure: true,
	});
};

export const verifySession = async (token: string | undefined) => {

	try {
		//! Remember that this expire, they must be replaced every seven days.
		const payload = jwt.verify(token as string, secret) as { userId: string };
		console.log('successfully decoded: session.ts');
		
		return payload.userId as string;
	} catch (e) {
		console.log('Failed to verify session at session.ts');

		return null;
	}
};

export const deleteSession = async () => {
	const cookieStore = await cookies();
	cookieStore.delete('SERVER_TOKEN');
};
