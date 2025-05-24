"use client"

import { getUserOwningRooms } from "@/actions/user-actions/getUserOwningRooms"
import InviteModal from "@/components/shared/InviteModal"
import { usePassiveSocketContext } from "@/context/passive-socket-context"
import { useSession } from "@/context/session-context"
import { useState } from "react"

type Props = {
    userId: string
}

export function  InviteToRoomButton({ userId}: Props) {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [ownRooms, setOwnRooms] = useState<InviteUserOwnRoomActionResponse["rooms"]>([])

    const socket = usePassiveSocketContext();
    const {session} = useSession()

    const strangerInviteInfo = {
        userId,
        socketId: null
    } as StrangerInfoPayload

    const handleClick = async ()=>{
            const {rooms: ownRooms} = await getUserOwningRooms(session!.id)

            setOwnRooms(ownRooms)

        setModalOpen(true)
    }
    
    return (
        <>
        
            <div className="flex justify-center  w-full mt-3">
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm hover:cursor-pointer" onClick={handleClick}>
                    Invite to Private Room
                </button>
            </div>
            {modalOpen && <InviteModal handleCloseModal={setModalOpen} rooms={ownRooms} strangerInviteInfo={strangerInviteInfo!}  socket={socket}></InviteModal>}
        </>


    )
}