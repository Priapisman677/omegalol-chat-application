import { RefObject } from "react"
import { Socket } from "socket.io-client"

export const useTypingReceiver = (socket: Socket, currentUsersTyping: RefObject<Set<string>>, setUsersTyping: (usersTyping: string[]) => void)=>{

    
    socket.on('receive-typing', (userId: string)=>{
        currentUsersTyping.current.add(userId)
        setUsersTyping([...currentUsersTyping.current])

        console.log(currentUsersTyping.current);
        

    })

    socket.on('receive-stop-typing', (userId: string)=>{
        currentUsersTyping.current.delete(userId)
        setUsersTyping([...currentUsersTyping.current])

        console.log(currentUsersTyping.current);
        

    })

    return
}