'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/generic-socket-context';
import { useRandomSocket } from '@/hooks/useRandomSocket';
import { useRandomChatContext } from '@/context/RandomRoomContext';

export type MatchStatus = 'idle' | 'Finding' | 'found'  | 'areYouSure' | 'stranger-left';

const statusStyles: Record<MatchStatus, string> = {
	idle: 'bg-orange-400 hover:bg-orange-300 border-orange-500',
	Finding: 'bg-orange-400 hover:bg-orange-300 border-orange-500',
	found: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-600',
	'stranger-left': 'bg-red-500 hover:bg-red-400 border-red-600',
	areYouSure: 'bg-red-500 hover:bg-red-400 border-red-600',
};

const statusParagraphs: Record<MatchStatus, React.ReactNode> = {
	idle: <p>🎯 Find a match</p>,
	Finding: <p>🔍 Finding... <br /> [esc to exit] </p>,
	found: <p>✅ Match found! <br /> [esc to exit]</p>,
	'stranger-left': <p>❌ Stranger left <br /> [esc to exit] </p>,
	areYouSure: <p>Are you sure? <br /> [esc to exit] </p>,
};

type Props = {
	insertMessage: (message: ClientPrivateMessage) => void,
	setMessages: (messages: ClientPrivateMessage []) => void,
	setUsersTyping: (usersTyping: string[]) => void
}

export function FindMatchButton({insertMessage, setMessages, setUsersTyping}: Props) {
	const socket = useSocket();

	const [status, setStatus] = useState<MatchStatus>('idle');
	const {setDisabled} = useRandomChatContext();

	//*This will make it so that if the user tries to close the random tab and they are in a match, they'll see a warning alert.
	function useWarnOnUnload(shouldWarn: boolean) {
	useEffect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (!shouldWarn) return;
			e.preventDefault();
			e.returnValue = ''; // Required for Chrome
		};

		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	}, [shouldWarn]);
	}


	useWarnOnUnload(status === 'found' || status === 'areYouSure');
	useRandomSocket(setStatus, insertMessage, setUsersTyping);
	
	const handleButton = ()=>{
		//? Use callbacks for confirmation if needed
		if (status === 'idle') {
			socket.emit('find-match');
			setStatus('Finding');
			setMessages([]);
		} else if (status === 'Finding') {
			socket.emit('stop-search');
			setStatus('idle');
		} else if ( status === 'found') {
			setStatus('areYouSure');
		} else if (status === 'areYouSure') {
			socket.emit('leave-room');
			setDisabled(true);
			setStatus('idle');
			insertMessage({
				messageType: 'event',
				textContent: "You disconnected",
				userId: 'event-user',
				profilePicPath: null,
				roomId: 'random room',
				username: 'gray',
				timeStamp: new Date()
			} as EventMessage);
			setUsersTyping([])
		} else if (status === 'stranger-left') {
			setStatus('idle');
			setMessages([])
		}
	}
	
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;

			handleButton()
		};

		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [status]);


	const handleClick = () => {
		handleButton()
	};


	return (
		<div
			className={`px-2 py-3 text-center font-mono font-bold border transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md  max-w-[150px] w-full ${statusStyles[status]}`}
			onClick={handleClick}
		>
			{statusParagraphs[status]}
		</div>
	);
}
