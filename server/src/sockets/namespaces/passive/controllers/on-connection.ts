import { Namespace, Socket } from "socket.io"
import { registerSocketHandlers } from "../register-handlers.js";
import { client } from "src/lib/redis-clients.js";
import { globalActiveUsersKey } from "@shared/keys/user-keys.js";
import { sendGlobalSocketsCount } from "../send-global-sockets-count.js";

export const onConnection = async(socket: Socket, namespace: Namespace)=>{
    
    console.log('Connection attempt to /passive from: ', socket.handshake.address);
    

    await sendGlobalSocketsCount(socket, namespace, 'add')
    
    if(!socket.user){ //* Unauthenticated users will be handled in a different way.
        socket.on('disconnect', async ()=>{
            await sendGlobalSocketsCount(socket, namespace, 'remove')
        })
        return
    }
    

    
    const userId = socket?.user?.id 
    await client.sAdd(globalActiveUsersKey(socket.user.id), socket.id) 

    await client.expire(globalActiveUsersKey(socket.user.id), 60 * 60) //* 1 hour.

    namespace.to(userId).emit('status-update', true) //$ Not going to perform a check of the count, this will always be true.

    registerSocketHandlers(socket, namespace)


    return
}