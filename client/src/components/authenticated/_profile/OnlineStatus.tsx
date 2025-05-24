"use client"

import { usePassiveSocketContext } from "@/context/passive-socket-context"
import { usePassiveSocket } from "@/hooks/usePassiveSocket"
import { useState } from "react"

export default function  OnlineStatus({online, userId}: {online: boolean, userId: string}) {


    const [onlineStatus, setOnlineStatus] = useState<boolean>(online)

    usePassiveSocket(userId, setOnlineStatus)

    const socket = usePassiveSocketContext();

    socket.emit('join-room', userId, (serverResponse: string)=>{console.log(serverResponse)}) //* This won't just be to listen for online events.


    return (
        <>
            {onlineStatus ? 
                <p className='text-[20px] text-green-500'>Online</p> :
                <p className='text-[20px] text-[#393939]'>Offline</p>
            }
        </>
    )
}