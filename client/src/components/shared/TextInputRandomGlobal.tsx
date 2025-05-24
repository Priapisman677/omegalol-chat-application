"use client"

import { useSocket } from "@/context/generic-socket-context";
import { useSession } from "@/context/session-context";
import { useTypingEmitter } from "@/hooks/useTypingEmitter";
import { useState } from "react";


type Props = {
    insertMessage: (message: ClientPrivateMessage) => void;
    disabled?: boolean
}
export function  TextInputRandomGlobal({ insertMessage, disabled}: Props) {
    const socket = useSocket()
    const {session} = useSession()



    const [textMessage, setTextMessage] = useState<string>('');
    const handleTextSubmit = () => {
        if (!textMessage) return;

        const message: ClientPrivateMessage = {
            textContent: textMessage,
            messageType: 'text',
            timeStamp: new Date(),
            userId: session?.id || null, 
            roomId: (socket as any)?.data?.matchRoom || 'randomroom',  //- Random room is determined in socket.data.matchRoom
            profilePicPath: session?.profilePicPath || null,
            username: session?.username || null,
            identifier: session?.id || socket.id!,
            countryCode: session?.countryCode || null,
            gender: session?.gender || null
        };

        setTextMessage('');
        socket.emit('send-message', message,  ({error}: {error: string | null}) => { error }); //$ There are still no errors for text messages but still the callback needs to be called.
        insertMessage(message);
    };

    useTypingEmitter(textMessage);
    

    return (
        <input className={`border border-[#373737] w-[85%] h-10 rounded-[7px] p-2 ${disabled ? 'bg-[#3a3a3a] text-[#6d6b6b] hover:cursor-not-allowed' : 'bg-[#272727]'}`}
        placeholder={`${ disabled ? 'Find a stranger before typing' : 'Type a message'} `}
        onChange={(e) => {
            setTextMessage(e.target.value);
        }}
        value={textMessage || ''}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                handleTextSubmit();
            }
        }}
        disabled={disabled}
        ></input>
    )
}