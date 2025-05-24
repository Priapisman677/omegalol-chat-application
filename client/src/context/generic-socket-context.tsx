"use client"
import { serverBaseURL } from '@/lib/network';
import React, { createContext, useContext, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

type Props = {
	children: React.ReactNode;
	nameSpace: string;
	withCredentials: boolean;
	autoConnect: boolean
};

export const SocketProvider = ({ children, nameSpace, withCredentials, autoConnect }: Props) => {
	
const socket = useMemo(() => io(serverBaseURL.href + nameSpace, {
	withCredentials,
	transports: ["websocket"],
	autoConnect
}), [nameSpace, withCredentials, autoConnect]);
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error('useSocket must be used within a <SocketProvider>');
	}
	return socket;
};