"use client"

import { leaveRoom } from "@/actions/room-actions/leave-room"
import { useSocket } from "@/context/generic-socket-context"
import { useRoomContext } from "@/context/RoomContext"
import { useSideBarContext } from "@/context/SideBarSWRcontext"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function  LeaveRoom() {

    const {roomMeta,} = useRoomContext()
    const {mutate} = useSideBarContext()
    const socket = useSocket()
    const router = useRouter()
    const handleLeave = async ()=>{
    
        const result = await leaveRoom(roomMeta?.id ||  '')


        if (!result.success) {
            toast.error(result.msg)
            return
        } 

        toast.success(result.msg)

        socket.emit('leave-room-forever', roomMeta?.id || '')
        await mutate()
        router.push('/chat')
        return
    }

    return (
        <p className="self-end mt-6 text-red-900 hover:cursor-pointer" onClick={handleLeave}> Leave room </p>
    )
}