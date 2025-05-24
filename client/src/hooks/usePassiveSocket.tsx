import { invitedToRoomToast } from '@/components/shared/InvitedToRoomToast';
import { usePassiveSocketContext } from '@/context/passive-socket-context';
// import { useSocket } from '@/context/socket-context';
import { useEffect } from 'react';

export function usePassiveSocket(
	visitingUserId: string,
	setOnlineStatus?: (status: boolean) => void,
	setGlobalUserCount?: (count: number) => void,
) {
	const socket = usePassiveSocketContext();

	useEffect(() => {
		socket.on('error', (e) => {
			console.log(e);
		});
		socket.on('connect_error', (e) => {
			console.log(e);
		});

		//*If invoked while visiting a profile:
		if (setOnlineStatus) {
			socket.on('status-update', (status: boolean) => {
				setOnlineStatus(status);
			});
		}

        //* If invoked while in random or global chat:
        if (setGlobalUserCount) {
            socket.on('global-sockets-count', (globalUserCount: number) => {
                setGlobalUserCount(globalUserCount);
            });
        }

		if (!socket.connected) {
			socket.connect();
		}

		
		socket.on('receive-room-invite', (payload: {roomId: string, username: string})=>{
			
			invitedToRoomToast(payload)

		})


		return () => {
			console.log('Disconnected from passive socket ');

			socket.off('connect_error');
			socket.off('error');
			socket.off('status-update');
            socket.off('receive-global-update');
            socket.off('global-sockets-count');
			socket.off('receive-room-invite');
		};
	}, [socket, visitingUserId]);
}
