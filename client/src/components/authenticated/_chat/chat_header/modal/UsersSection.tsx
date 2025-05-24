"use client"
import { X } from "lucide-react";
import { useSession } from "@/context/session-context";
import { deleteUserFromRoom } from "@/actions/room-actions/delete-user-from-room";
import { useRoomContext } from "@/context/RoomContext";
import { CirclePictureSmall } from "@/components/authenticated/shared/CirclePictureSmall";
import { internalBaseURL } from "@/lib/network";

export default function  UsersSection() {

    const {mutateMeta, roomMeta, role} = useRoomContext()


    const deleteUser = async (userId: string)=>{
		await deleteUserFromRoom(userId, roomMeta!.id)
		await mutateMeta()
		return
	}

    const {session} = useSession()
	const selfId = session?.id

    return (
        <div className="max-h-[300px] overflow-y-scroll custom-scrollbar">
            {roomMeta!.users.map((user, idx) => {

                const imageSrc = user?.profilePicPath 
                ? new URL(`/api/getprofileroomimage?imagename=${user.profilePicPath.split('/').pop()}&type=profile-pics`, internalBaseURL).href
                : '/default-profile-pic.png';

                return (
                    <div key={user.id}>
                        <div className="ml-2 flex justify-between">
                            <div className="flex gap-3 items-center">
                                <CirclePictureSmall src={imageSrc} proportions={8}></CirclePictureSmall>
                                <p>{user.username}</p>
                                <p className="text-[#6e6e6e] text-sm">{user.id}</p>
                                {user.role === 'admin' && <p className="text-[#0f8200] text-sm"> Owner </p>}
                            </div>
                            {(user.id !== selfId) && (role === 'admin') && <div className="hover:cursor-pointer" onClick={()=>{deleteUser(user.id)}}> 
                                <X className="text-red-900" />
                            </div>}
                        </div>
                        
                        {idx < roomMeta!.users.length - 1 && (
                                <div className="my-2 border-t border-gray-600 opacity-40" />
                        )}
                    </div>
                );
            })}

        </div>
    )
}