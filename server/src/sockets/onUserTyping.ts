// import { Socket } from "socket.io"

// export const onUserTyping = (socket: Socket, defaultRoom?: string)=>{

//     //$ In private rooms the room should be sent in the payload. In global and random shots you will pass the room which is currently optional.

//     if(!defaultRoom){ //* For private rooms:

//          socket.on('send-typing', (roomId: string)=>{
//             socket.to(roomId).emit('receive-typing',socket.user?.username || socket.id)
//         })

//         socket.on('send-stop-typing', (roomId: string)=>{
//             socket.to(roomId).emit('receive-stop-typing' ,socket.user?.username || socket.id)
//         })

//     } else{ //* For global and random rooms:

//         socket.on('send-typing', ()=>{

//             console.log(defaultRoom);
            

//             socket.to(defaultRoom).emit('receive-typing',socket.user?.username || socket.id)
//         })

//         socket.on('send-stop-typing', ()=>{
//             socket.to(defaultRoom).emit('receive-stop-typing' ,socket.user?.username || socket.id)
//         })
//     }

   
//     return
// }