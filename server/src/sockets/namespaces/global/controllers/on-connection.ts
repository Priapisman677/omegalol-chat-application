import { Namespace, Socket } from "socket.io"
import { registerSocketHandlers } from "../register-handlers.js";

export const onConnection = (socket: Socket, namespace: Namespace)=>{
    console.log('Connection attempt to /global from', socket.request.connection.remoteAddress, 'socket id: ', socket.id);
    registerSocketHandlers(socket, namespace)

}