import { globalActiveIPsKey } from "@shared/keys/user-keys.js";
import { Namespace, Socket } from "socket.io";
import { client } from "src/lib/redis-clients.js";

 export const sendGlobalSocketsCount  = async(socket: Socket, namespace: Namespace, action: 'add' | 'remove')=>{
    
    const cleanedIp = socket.handshake.address.replaceAll(':', '');
    const key = globalActiveIPsKey(cleanedIp);

    if(action === 'add') await client.sAdd(key, socket.id ) 
    if(action === 'remove') await client.sRem(key, socket.id )

    const count = await client.keys(globalActiveIPsKey('*'))

    namespace.emit('global-sockets-count', count.length)
}