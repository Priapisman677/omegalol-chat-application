import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): string | null => {
	
	try {
		//¡ Remember that this expire, they must be replaced every seven days.
		const payload: any = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
		return payload.userId;
	} catch (e) {
		console.log('Verify token failed at tokens.ts');
		return null;
	}
};
