import { Namespace, Socket } from "socket.io"
import { registerSocketHandlers } from "../registerHandlers.js";

export const onConnection = (socket: Socket, _namespace: Namespace)=>{
    console.log('Connection attempt to /random from', socket.request.connection.remoteAddress);
    
    registerSocketHandlers(socket, _namespace)
}