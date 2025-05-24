import { useSocket } from '@/context/generic-socket-context';
import {  useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useTypingReceiver } from './useTypingReceiver';

export function useChatSocket(
	roomId: string,
	handleMessage?: (msg: ClientPrivateMessage) => void,
	updateOnlineCount?: (onlineUsersCount: number) => void,
	setUsersTyping?: (usersTyping: string[]) => void
) {
	const socket = useSocket();
	const router = useRouter();
	const currentUsersTyping = useRef<Set<string>>(new Set());
	
	useEffect(() => {
		socket.on('error', (e) => {
			console.error(e);
		});
		socket.on('connect_error', (e) => {
			console.error(e);
		});

		socket.on('error-event', (e: string) => { //$ These are our custom events.
			console.error(e);
		});


		if(handleMessage){//* If the user is at /chat this should not run, However the user can still receive things such as duplicate-connection events
			socket.on('receive-message', (payload: ClientPrivateMessage) => {
				//$ Even if there were 10 receive-message listeners, there would be ten "AAA" logs to the console but ONLY ONE message displayed.
				//$ I understood why for about 10 seconds LOL but I make sure that on my notes is the correct explanation.
				console.log('Received message:', payload);
				handleMessage(payload);
			});
	
			socket.on('receive-event', (payload: EventMessage)=>{
				console.log('Received event:', payload);
				handleMessage(payload)
			})

		}
		if(updateOnlineCount){
			socket.on('get-online-users', (serverPayload: number)=>{
				updateOnlineCount(serverPayload)
			})
		}
		if(setUsersTyping){
			useTypingReceiver(socket, currentUsersTyping, setUsersTyping)
		}

		socket.on( 'prevent-duplicate-connection', (_serverPayload: { msg: string }) => {
				router.push('/duplicate-connection');
			}
		);
		

		socket.on('kick-out', (serverPayload: string)=>{
			const receivedRoomId = serverPayload
			
			if(roomId === receivedRoomId){
				router.push('/chat')
			}
		})



		socket.on('ready', onReady);
		
		function tryJoinRoom  ()  {
			// - Why "tryJoinRoom"
        	// - Previously, I was emitting the join-room event as soon as this hook ran, together with all the other listeners...
			//- Now I wait for the "ready" event from the server, Sometimes in production it takes up to seconds in order for that event to fire.
        	// $ Gave me one of the longest debug times 🐞🐞🐞
			socket.emit('join-room', roomId, (res: string) => {
				console.log(res);
			});

		};
	
		function onReady () {
			//* Here goes all functions you want to join only when the the socket has completely been registered on the server (reruns when this hook remounts).
			if(roomId === 'home' || roomId === 'profile' ) return
			tryJoinRoom();
            console.log('connected to private with', socket.id); 

		};


		if (!socket.connected) {

			socket.connect(); //* I set autoconnect to False in the socket context so I could use this.
		}else {
			onReady(); //* If user just changes rooms, socket will remain connected but need to trigger "tryJoinRoom()" again.
		}

		return () => {
			console.log('UNMOUNTING USE EFFECT private');


			socket.off('ready');
			socket.off('receive-message');
			socket.off('error-event');
			socket.off('connect_error');
			socket.off('error');
			socket.off('kick-out')
			socket.off('join-room');
			socket.off('get-online-users');
			socket.off('prevent-duplicate-connection');
			socket.emit('leave-room', roomId, (_res: string) => { //* This does not refer to leaving the room together, it is just leaving it momentarily.
				// console.log(res);
			});
			// socket.disconnect() //$ useEffect doesn't run this when the component unmounts.
		};
	}, [roomId, socket]); /// "React rules of hooks require that any variable from outside the effect must be in the dependency array, unless you're 100% sure it’s stable."

	/// "Even if in practice the socket doesn't change, you're telling React:
	/// “I’m using socket inside this effect, and if it ever changes, re-run the effect.”
}
