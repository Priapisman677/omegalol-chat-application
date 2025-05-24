import { useSocket } from '@/context/generic-socket-context';
import { useEffect, useRef } from 'react';
import { useTypingReceiver } from './useTypingReceiver';
import { useSession } from '@/context/session-context';

export function useGlobalSocket(
    insertMessage: (message: ClientPrivateMessage) => void,
    setUsersTyping: (usersTyping: string[]) => void,
    setChatIdentifier: (chatIdentifier: string) => void
) {
    const { session } = useSession() as { session: UserSession | null }; 
    console.log('running useGlobalSocket');
    
    const socket = useSocket();
    const currentUsersTyping = useRef<Set<string>>(new Set())
    

        
    useEffect(() => {
        console.log('running useGlobalSocket useEffect');

        socket.on('error', (e) => {
            console.log(e);
        });
        socket.on('connect_error', (e) => {
            console.log(e);
        });

        socket.on( 'receive-message', (payload: ClientPrivateTextMessage,) => {
                console.log(payload);
                insertMessage(payload);
            }
        );

        //* Similar pattern to useRandomSocket
        socket.on('ready', onReady)

        function tryJoinRoom  ()  {
            const identifier = session?.id ? session.id : socket.id!
            setChatIdentifier(identifier);
			socket.emit('join-room', session?.username || identifier);

		};

        function onReady (){
            tryJoinRoom();
            console.log('connected to global with', socket.id); 
        }
        if (!socket.connected) {
            //! I believe I won't need this
            socket.connect();
            console.log('Connected to global socket with id: ', socket.id);
        }else{
            onReady();
        }


        useTypingReceiver(socket, currentUsersTyping, setUsersTyping)
    
        return () => {
            console.log('Unmounting global socket ');
            socket.disconnect();
            socket.off('connect_error');
            socket.off('error');
            socket.off('receive-message');
            socket.off('ready');
        };
    }, [socket]);
}
