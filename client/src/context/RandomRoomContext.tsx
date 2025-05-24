"use client"
import React, { createContext, useContext, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

interface RandomChatContextType {
    disabled: boolean;
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    strangerInviteInfo: StrangerInfoPayload | undefined;
    setStrangerInviteInfo: React.Dispatch<React.SetStateAction<StrangerInfoPayload | undefined>>;
}

export const randomChatContext = createContext<RandomChatContextType | null>(null);

export const RandomChatProvider = ({ children }: Props) => {

    const [disabled, setDisabled] = useState<boolean>(true);
    const [strangerInviteInfo, setStrangerInviteInfo] = useState<StrangerInfoPayload | undefined>(undefined);
    
    const value = {
        disabled,
        setDisabled,
        strangerInviteInfo,
        setStrangerInviteInfo
    };

    return (
        <randomChatContext.Provider value={value}>
            {children}
        </randomChatContext.Provider>
    );
};

export const useRandomChatContext = () => {
    const socket = useContext(randomChatContext);
    if (!socket) {
        throw new Error('useRandomChatContext must be used within a <RandomChatProvider>');
    }
    return socket;
};
