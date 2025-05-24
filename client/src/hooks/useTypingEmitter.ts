
import { useEffect } from 'react';
import { useSocket } from '@/context/generic-socket-context';

export function useTypingEmitter(text: string, roomId?: string) {
	const socket = useSocket();

	useEffect(() => {
		if (!socket) return;

		if (text.trim().length > 0) { //$ It will be better to send an event every keypress, that way if a user just join a room and the other strangers still typing they'll get the event again.
            console.log('typing');
            
			socket.emit('send-typing', roomId || null);
		} else {
			socket.emit('send-stop-typing', roomId) || null;
		}
	}, [text, roomId, socket]);
}
