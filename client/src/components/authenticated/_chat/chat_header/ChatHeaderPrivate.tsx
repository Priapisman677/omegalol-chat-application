"use client"

import { useState } from "react"
import { useRoomContext } from "@/context/RoomContext"
import { Modal } from "./modal/Modal"
import { CirclePictureSmall } from "../../shared/CirclePictureSmall"
import { internalBaseURL } from "@/lib/network"
import UsersTyping from "@/components/shared/UsersTyping"


type Props = {
    usersOnline: number,
    usersTyping: string[]
}

//prettier-ignore
export function  ChatHeaderPrivate({usersOnline, usersTyping}: Props) {

	const atLeastOneOnline = usersOnline > 0
    const [modalOpen, setModalOpen,] = useState(false)
    
    const {roomMeta } = useRoomContext()
    if(!roomMeta) return <p>'Error  at ChatHeader'</p>

    const imageSrc = roomMeta?.roomPicPath 
    ? new URL(`/api/getprofileroomimage?imagename=${roomMeta.roomPicPath.split('/').pop()}&type=room-pics`, internalBaseURL).href
    : '/group.png';

    return (
        <>
            <div className="flex justify-between items-center bg-[#1f1f1f]">
                <div className="w-full h-11  flex gap-2 border-t border-[#232323] px-5 items-center">
                    <>
                    </>
                    <CirclePictureSmall src={imageSrc} proportions={10} onClick={() => setModalOpen(true)}></CirclePictureSmall>
                    <div className="flex  flex-col">
                        <div className="flex items-center">
                            <p className=" font-bold text-sm">{roomMeta.roomName || 'No name'}</p>
                            <div className="text-[#6d6b6b] text-sm flex items-center  pl-2 ml-2">
                                <div className={`w-2 h-2 rounded-full mr-2 ${atLeastOneOnline ? 'bg-green-500' : 'bg-gray-500'}`}/>
                                {usersOnline}  online
                            </div>
                        </div>
                        <UsersTyping usersTyping={usersTyping}></UsersTyping>
                    </div>

                </div>
                <p className="text-[#6d6b6b] mr-5 font-bold text-sm"> {roomMeta.isPrivate ? 'Private' : 'Public'} </p>
            </div>
                                                    {modalOpen && (<Modal setModalOpen={setModalOpen}></Modal>)}
        </>
    )
}

