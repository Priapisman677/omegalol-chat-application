import { Socket,  Namespace} from 'socket.io';
import { onFindMatch } from './controllers/on-find-match.js';
import { onStopSearch } from './controllers/on-stop-searcht.js';
import { onDisconnect } from './controllers/on-disconnect.js';
import { onLeaveRoom } from './controllers/on-leave-room.js';
import { onSendMessage } from './controllers/on-send-message.js';
import { onSendInvite } from 'src/sockets/on-send-invite.js';


export const registerSocketHandlers = (socket: Socket, namespace: Namespace) => {
    socket.on('send-message', async(payload: ClientPrivateMessage, cb)=>{
        await onSendMessage(socket, payload, cb)
    })

    socket.on('find-match', async ()=>{
        await onFindMatch(socket, namespace)
    })

    socket.on('stop-search', async ()=>{
        await onStopSearch(socket)
    })

    socket.on('disconnect', async ()=>{
        onDisconnect(socket)
    })

    socket.on('leave-room', (async ()=>{
        await onLeaveRoom(socket)
    }))


    //! Do not try to put this under fine match because that will only run when the user starts finding a match not after it's been found.
	socket.on('send-typing', ()=>{
		socket.to(socket.data.matchRoom).emit('receive-typing',socket.user?.username || 'Stranger ' + socket.id)
	})

	socket.on('send-stop-typing', ()=>{
		socket.to(socket.data.matchRoom).emit('receive-stop-typing' ,socket.user?.username || 'Stranger ' + socket.id)
	})



    // onUserTyping(socket, socket.data.matchRoom)

    //*Auth required ⚠️
    
    if(socket.user){
        socket.on('send-room-invite', async (payload: InviteToRoomMessage)=>{ //% payload is roomId
            await onSendInvite(socket,  payload, socket.data.matchRoom)
        })
    };
}

