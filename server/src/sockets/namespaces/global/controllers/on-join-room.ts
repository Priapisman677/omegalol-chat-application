import { Socket,  } from 'socket.io';

export const onJoinRoom = ( socket: Socket, chatIdentifier: string, roomName: string)=>{


    socket.join(roomName);

    console.log({socketid: socket.id, username: socket.user?.username, room: roomName});
    

    socket.to(roomName).emit('receive-message', {
        messageType: 'event',
        textContent: chatIdentifier + ' joined!',
        userId: 'event-user',
        profilePicPath: null,
        timeStamp: new Date(),
        roomId: (socket as any).data?.matchRoom || 'random room', //* I think this does not serve any purpose as of now.
        username: 'green'
    } as EventMessage)

    return
}
