"use client"
import { serverBaseURL } from '@/lib/network';
import React, { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

type Props = {
    children: React.ReactNode;
};

const socket = io(serverBaseURL.href + 'passive', {
    withCredentials: false,
    transports: ["websocket"],
    autoConnect: true
});
console.log('connected to passive');

export const PassiveSocketProvider = ({ children,}: Props) => {

    

    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const usePassiveSocketContext = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('usePassiveSocketContext must be used within a <SocketProvider>');
    }
    return socket;
};