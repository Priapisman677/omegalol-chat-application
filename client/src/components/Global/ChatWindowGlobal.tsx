'use client';

import {  useState } from 'react';
import ChatMessages from '../shared/ChatMessages';
import { RandomGlobalChatHeader } from '../shared/RandomGlobalChatHeader';
import { useGlobalSocket } from '@/hooks/useGlobalSocket';
import { ChatInputGlobal } from './ChatInputGlobal';
import { MinimalCenteredModal } from '../shared/MotionModal';

interface Props {
    initialMessages: ClientPrivateMessage[];
}

export default function ChatWindowGlobal({initialMessages}: Props) {
    const [messages, setMessages] = useState<ClientPrivateMessage[]>(initialMessages ||  []);
    const [chatIdentifier, setChatIdentifier] = useState<string | undefined>(undefined);
    const [usersTyping , setUsersTyping] = useState<string[]>([])

    //* TEMPORARY:
    const [showModal, setShowModal] = useState(true);
    

    const insertMessage = (newMessage: ClientPrivateMessage) => {
        setMessages((prev) => [...prev, newMessage]);
    };

    const [disabled, _setDisabled] = useState<boolean>(false); //? Use for temporary BAN

    
    useGlobalSocket(insertMessage, setUsersTyping, setChatIdentifier) //! For some reason this needs to be before the !ready condition or return statement.



    //* TEMPORARY:
    return        <MinimalCenteredModal show={showModal} onClose={() => setShowModal(false)} />
     
    
    if (!chatIdentifier) return null;  //- Under the hood the component first returns null and as soon as the shed identifier is ready it renders the component.
    
   

    return (
        <>
            <RandomGlobalChatHeader usersTyping={usersTyping}></RandomGlobalChatHeader>
            {/* //$ I don't know how "overflow-hidden" fixed the fact that without "overflow-hidden" there were issues with a second scrollbar */}
            <div className="flex flex-col h-[100%] overflow-hidden border-t border-[#3a3a3a]">
            
                <ChatMessages messages={messages} chatIdentifier={chatIdentifier}></ChatMessages>
                <div className='flex h-15 border-t border-[#3a3a3a]'>
                    <ChatInputGlobal insertMessage={insertMessage} disabled={disabled}></ChatInputGlobal>
                </div>
            </div>
            <MinimalCenteredModal show={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
