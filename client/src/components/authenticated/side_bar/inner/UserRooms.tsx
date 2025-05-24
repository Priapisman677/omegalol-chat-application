"use client"

import Link from "next/link"
import { CirclePictureSmall } from "../../shared/CirclePictureSmall"
import { internalBaseURL } from "@/lib/network";
import { FaUser } from "react-icons/fa6";
type Props = {
  rooms: userRoom[] | PublicRoomsActionResponse['rooms'] | InviteUserOwnRoomActionResponse['rooms']
}

//prettier-ignore
export default function  UserRooms({rooms}: Props) {
  
    return (
      <nav className="flex flex-col mb-6">
        {rooms && rooms?.map((room, index)=>{
          const imageSrc = room?.roomPicPath 
          ? new URL(`/api/getprofileroomimage?imagename=${room.roomPicPath.split('/').pop()}&type=room-pics`, internalBaseURL).href
          : '/group.png';

          return (
            <Link  href={'/chat/' + room.id} className="flex items-center hover:bg-[#262626]" key={index}>
              <div  className="flex items-center gap-2  my-1 min-w-0" >
                <CirclePictureSmall src={imageSrc} proportions={10}></CirclePictureSmall>
                <p className="text truncate overflow-hidden whitespace-nowrap flex-1">{room.roomName}</p>
                <div>
                  {/* //* For "Your rooms section" */}
                  { room?.unReadMessages ? (room.unReadMessages !== 0) &&  <BadgeCircle count={room.unReadMessages}></BadgeCircle> : ''} 
                  {/* //* For "Public rooms section" */}
                  { room.roomUserCount && <UserCountIcon count={room.roomUserCount}></UserCountIcon>}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>
    )
}


function BadgeCircle({ count }: { count: number }) {
  return (
    <div className="w-6 h-6 rounded-full bg-[#9c0101] text-white text-sm font-semibold flex items-center justify-center">
      {count}
    </div>
  );
}

function UserCountIcon({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      <FaUser size={13} className="text-gray-500"></FaUser>
      <p className="text-[12px]">{count}</p>
    </div>
  );
}