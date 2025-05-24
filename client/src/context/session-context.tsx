"use client"

import { getUserInfo } from "@/actions/user-actions/get-user-info";
import { logOut } from "@/actions/user-actions/log-out";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
	session: UserSession | null;
    setSession: (user: UserSession | null) => void;
	logoutUser: () => void;
};

const SessionContext = createContext<AuthContextType | null>(null)

export default function  SessionProvider({initialSession, children}: { initialSession: UserSession | null, children: React.ReactNode}) {

    const [session, setSession] = useState<AuthContextType['session'] | null>(initialSession || null);
	const router = useRouter();
	//$ Yes, this useEffect will run again if you refresh the browser.

	//$ It will not run again just by navigating between client-side routes, as long as the SessionProvider isn’t unmounted during the transition.
	useEffect(() => {
		const fetchUserInfo = async () => {

			const user = await getUserInfo();
			if (user) {
				setSession(user);
			} else {
				console.log('No user found at session-context.tsx');
				setSession(null);
				
                // router.push('/login');  //! New update, you can have explicit null session
			}
		};
		fetchUserInfo();
	}, []);

	const logoutUser = async () => {
		await logOut();
		setSession(null);
		router.push('/login');
		return;
	};

	const value: AuthContextType = { session, setSession, logoutUser };

	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	);
}

export const useSession = () => {
	const session = useContext(SessionContext);
	if (!session) {
		throw new Error(
			'useSession must be used within a <SocketProvider>'
		);
	}
	return session;
};
