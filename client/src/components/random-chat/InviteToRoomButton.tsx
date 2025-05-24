"use client"

import { useState } from "react"
import InviteModal from "../shared/InviteModal"
import { useSession } from "@/context/session-context"
import { getUserOwningRooms } from "@/actions/user-actions/getUserOwningRooms"
import toast from "react-hot-toast"
import { useRandomChatContext } from "@/context/RandomRoomContext"
import { useSocket } from "@/context/generic-socket-context"




export function  InviteToRoomButton() {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const {session} = useSession()
    const {disabled} = useRandomChatContext();
    const [ownRooms, setOwnRooms] = useState<InviteUserOwnRoomActionResponse["rooms"]>([])

    const {strangerInviteInfo} = useRandomChatContext(); //* Only applies for random chats.
    const socket = useSocket();

    const handleClick = async ()=>{
        if(!session){
            toast.error('You need to have an account.')
            return
        }

        // if(!strangerInviteInfo?.userId){ toast.error('Stranger is not a registered user')} //$ If the stranger doesn't have an account invite will be sent anyway, no cache will be set, though.


        const {rooms: ownRooms} = await getUserOwningRooms(session.id)

        setOwnRooms(ownRooms)
        setModalOpen(true)
        return
    }
    //prettier-ignore
    return (
        <>
            <div className='  flex justify-center items-center px-2 w-[100px]'>
                <button className={`w-full rounded-[15px] px-3 font-semibold text-[14px] leading-none h-[85%] max-h-[42px]
                ${disabled ? 'bg-gray-500 cursor-not-allowed text-gray-400' : 'bg-[#1E40AF] hover:bg-[#1D4ED8] cursor-pointer transition-colors duration-200'}`} onClick={handleClick} disabled={disabled}>
                    <span className="block">Invite to</span>
                    <span className="block">Private!</span>
                </button>
            </div>
            {modalOpen && <InviteModal handleCloseModal={setModalOpen} rooms={ownRooms} strangerInviteInfo={strangerInviteInfo!} socket={socket}></InviteModal>}
        </>
    )
}