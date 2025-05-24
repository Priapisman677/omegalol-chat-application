"use client"

import { internalBaseURL } from "@/lib/network"
import { CirclePictureSmall } from "../authenticated/shared/CirclePictureSmall"
import Link from "next/link"
import { Socket } from "socket.io-client"



type SharedFileModalProps = {
    handleCloseModal: ( open: boolean)=>void,
    rooms: InviteUserOwnRoomActionResponse['rooms'],
    strangerInviteInfo: StrangerInfoPayload,
    socket: Socket
}

//prettier-ignore
export default function  InviteModal({handleCloseModal, rooms, strangerInviteInfo, socket}: SharedFileModalProps) {
//$  Socket is being passed dynamically because it depends if you are in profile page which requires the passive socket or if you are in random which requires the generic socket.



    const inviteUserToRoom =  (roomId: string)=>{
        socket.emit('send-room-invite', {
            roomId,
            strangerInviteInfo
        } as InviteToRoomMessage)
        handleCloseModal(false)
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={()=>{handleCloseModal(false)}}>

            <div className="bg-[#131313] border border-[#202020] rounded flex flex-col w-[90vw] max-w-[420px] min-w-[300px]"
                onClick={(e) => e.stopPropagation()}>
                <p className="font-bold p-4 text-center">Invite stranger to one of your rooms</p>

                {/* //* Items SCROLLABLE */}
                <div className="h-70 overflow-y-scroll custom-scrollbar  pl-4">
                    {rooms.map((room, index)=>{
                        const imageSrc = room?.roomPicPath 
                        ? new URL(`/api/getprofileroomimage?imagename=${room.roomPicPath.split('/').pop()}&type=room-pics`, internalBaseURL).href
                        : '/group.png';
                        return (
                            <div className="h-12 hover:bg-[#262626] hover:cursor-pointer flex items-center px-1"
                            key={index} onClick={()=>{inviteUserToRoom(room.id)}}>
                                <div  className="flex items-center gap-2  my-1 min-w-0">
                                    <CirclePictureSmall src={imageSrc} proportions={10}></CirclePictureSmall>
                                    <p>{room.roomName}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Link href={'/chat'} target="_blank" rel="noopener noreferrer"
                className="self-end p-3  bg-[#231d6e] hover:cursor-pointer m-2 rounded-[20px]">
                        <p className="text-sm">Create new room</p>
                </Link>

            </div>
        </div>
    )
}