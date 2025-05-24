'use client';

import { useEffect, useState } from 'react';
import ChatMessages from '../../shared/ChatMessages';
import { useChatSocket } from '@/hooks/useChatSocket';
import {ChatHeaderPrivate} from './chat_header/ChatHeaderPrivate';
import { useSession } from '@/context/session-context';
import ChatInputPrivate from './chatInput/ChatInputPrivate';
import { useSideBarContext } from '@/context/SideBarSWRcontext';
import { usePassiveSocket } from '@/hooks/usePassiveSocket';
import { MinimalCenteredModal } from '@/components/shared/MotionModal';

interface Props {
	roomId: string;
	initialMessages: ClientPrivateMessage[];
	usersOnline: number
}

export default function ChatWindow({ roomId, initialMessages, usersOnline}: Props) {
	const [messages, setMessages] = useState<ClientPrivateMessage[]>(initialMessages || []);
	const [onlineCount, setOnlineCount] = useState<number>(usersOnline)
	const [usersTyping , setUsersTyping] = useState<string[]>([])
	      //* TEMPORARY:
	const [showModal, setShowModal] = useState(true);
	
	const {mutate} = useSideBarContext()

	useEffect(() => {
		const useMutate = async () => {
			await mutate()
		}
		useMutate()
	}, [])


	const insertMessage = (newMessage: ClientPrivateMessage) => {
		setMessages((prev) => [...prev, newMessage]);
	};

	const updateOnlineCount = (onlineUsersCount: number)=>{
	
		setOnlineCount(onlineUsersCount)
	
		return
	}

	useChatSocket(roomId, insertMessage, updateOnlineCount, setUsersTyping);
	usePassiveSocket('private') //* This is just being called to set listeners to receive invitations.
	const { session } = useSession() as { session: UserSession | null }; //% Contrary to random chats, the identifier here will be the user ID so that when you load messages they can be consistent.
	

	return (
		<>
			<ChatHeaderPrivate usersOnline={onlineCount} usersTyping={usersTyping}></ChatHeaderPrivate>
			{/* //$ I don't know how "overflow-hidden" fixed the fact that without "overflow-hidden" there were issues with a second scrollbar */}
			<div className="flex flex-col h-full overflow-hidden">
				<ChatMessages messages={messages} chatIdentifier={session?.id}></ChatMessages>
				<ChatInputPrivate insertMessage={insertMessage}></ChatInputPrivate>
			</div>
			<MinimalCenteredModal show={showModal} onClose={() => setShowModal(false)} />
		</>
	);
}
