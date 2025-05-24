"use client"

import { useRoomContext } from "@/context/RoomContext";
import { useSession } from "@/context/session-context";
import { useSocket } from "@/context/generic-socket-context";
import { useState } from "react";
import { useSideBarContext } from "@/context/SideBarSWRcontext";
import { useTypingEmitter } from "@/hooks/useTypingEmitter";

//prettier-ignore
export function  TextInputPrivate({  insertMessage}: { insertMessage: (message: ClientPrivateMessage) => void;}) {

    const socket = useSocket();

    const { session } = useSession();

    const {roomMeta} = useRoomContext()

    const {mutate} = useSideBarContext()

	if (!session) return null;

    const [textMessage, setTextMessage] = useState<string>('');
    const handleTextSubmit = async () => {
        if (!textMessage) return;

        const message: ClientPrivateTextMessage = {
            textContent: textMessage,
            messageType: 'text',
            username: session.username,
            roomId: roomMeta!.id,
            userId: session.id,
            profilePicPath: session.profilePicPath,
            timeStamp: new Date(),
            identifier: session.id,
            countryCode: session.countryCode,
            gender: session.gender
        };
        socket.emit('send-message', message);
        insertMessage(message);
        setTextMessage('');
        await mutate()
    };

    useTypingEmitter(textMessage, roomMeta?.id);

    return (
        <input className="border border-[#373737] w-[85%] h-10 rounded-[7px] p-2 bg-[#272727]"
            placeholder="Type your message" onChange={(e) => {
                setTextMessage(e.target.value);
            }}
            value={textMessage || ''}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleTextSubmit();
                }
            }}
        ></input>
    )
}