'use client';

import { useState } from 'react';
import ChatMessages from '../shared/ChatMessages';
import { useSocket } from '@/context/generic-socket-context';
import {FindMatchButton} from './FindMatchButton';
import { useSession } from '@/context/session-context';
import { RandomGlobalChatHeader } from '../shared/RandomGlobalChatHeader';
import { InviteToRoomButton } from './InviteToRoomButton';
import { ChatInputRandom } from './ChatInputRandom';
// import { useChatSocket } from '@/hooks/useChatSocket';
// import {ChatHeader} from './chat_header/ChatHeader';

interface Props {
    
}

export default function ChatWindowRandom({ }: Props) {
    const [messages, setMessages] = useState<ClientPrivateMessage[]>([]);
    const [usersTyping , setUsersTyping] = useState<string[]>([])


    const insertMessage = (newMessage: ClientPrivateMessage) => {
        setMessages((prev) => [...prev, newMessage]);
    };

    const { session } = useSession() as { session: UserSession | null }; 
    const socket = useSocket()

    const chatIdentifier = session?.id ? session.id : socket.id!

    //prettier-ignore
    return (
        <>
            {/* //$ I don't know how "overflow-hidden" fixed the fact that without "overflow-hidden" there were issues with a second scrollbar */}
            <div className="flex flex-col h-full overflow-hidden">
                <RandomGlobalChatHeader usersTyping={usersTyping}></RandomGlobalChatHeader>
                <ChatMessages messages={messages} chatIdentifier={chatIdentifier}></ChatMessages>
                <div className='flex bg-[#272727] border-t border-[#3a3a3a]'>
                    <FindMatchButton insertMessage={insertMessage} setMessages={setMessages} setUsersTyping={setUsersTyping}></FindMatchButton>
                    <InviteToRoomButton></InviteToRoomButton>
                    <div className='w-[70%]'>
                        <ChatInputRandom insertMessage={insertMessage}></ChatInputRandom>
                    </div>
                </div>
            </div>
        </>
    );
}
