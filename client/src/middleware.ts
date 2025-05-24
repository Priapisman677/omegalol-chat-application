import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { internalBaseURL } from './lib/network';


				
				

const protectedRoutes: string[] = ['/chat', '/api', '/profile']; //% "/chat" not only protects the /chat pages, it also protects server actions (they are called like "POST chat/123abc")
//! Meaning that every time you add a server action you also need to include the path to where it's going to be called in the "protectedRoutes" array.
//% Another option would be to always check for the "userId" header (that gets appended if validation succeeds) in every server action.

const publicRoutes = ['/signup', '/login'];

export const middleware = async (req: NextRequest) => {

	const path = req.nextUrl.pathname;

    // prettier-ignore
	if (path.startsWith('/_next/') || path === '/favicon.ico' || path.startsWith('/api/getsessioninfo')) {
		return NextResponse.next();
	}

	const cookieStore = await cookies();
	const cookie = cookieStore.get('SERVER_TOKEN')?.value;

	const response = await fetch(
		new URL('/api/getsessioninfo', internalBaseURL),
		{
			headers: {Cookie: `SERVER_TOKEN=${cookie}`,},
		}
	);
    
	let user;
	try {
        //prettier-ignore
		if (response.status === 401 || response.status === 404 || response.status === 500) {
			user = null;
		} else {
			user = (await response.json()) as {
				message: string;
				data: {
						id: string;
						username: string;
						email: string;
				};
			};

		}
	} catch (e) {
		console.error('API Error at middleware.ts');
	}

	if (!user) {
		console.log('No user found at middleware.ts, deleting cookie');
		cookieStore.delete('SERVER_TOKEN');
	}


	// if(req.nextUrl.pathname === '/'){
	// 	return NextResponse.rewrite(new URL('/global', req.nextUrl))
	// }



	//*								     	Including dynamic routes like /chat/iashd7uu2noksa or api/asd
	if (!user && (protectedRoutes.includes(path)  || protectedRoutes.find((route)=>{return path.startsWith(route)}))) {

		const url = new URL('/signup', req.nextUrl);

		return NextResponse.redirect(url);
	}

	if (user && publicRoutes.includes(path)) {
		const url = new URL('/global', req.nextUrl);
		return NextResponse.redirect(url);
	}


	//* If auth is valid and user gets this far:
	const final = NextResponse.next();
	// const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

	//! Right now this will always be set, even if the user is not logged in (undefined will be sent).
	final.headers.set('userId', user?.data?.id ?? '')//.userId!);


	return final;

};
