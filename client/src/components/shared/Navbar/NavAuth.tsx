"use client"

import { CirclePictureSmall } from "@/components/authenticated/shared/CirclePictureSmall";
import { useSession } from "@/context/session-context";
import { internalBaseURL } from "@/lib/network";
import Link from "next/link";
import { useState } from "react";

export function  NavAuth() {
    const [open, setOpen] = useState(false);
    const {logoutUser, session} = useSession()
    const imageSrc = session?.profilePicPath 
  	? new URL(`/api/getprofileroomimage?imagename=${session.profilePicPath.split('/').pop()}&type=profile-pics`, internalBaseURL).href
 	: '/default-profile-pic.png';

    return (
        <div
            className="w-[15%] h-full flex items-center justify-center gap-2 relative group"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Avatar + Username */}
            <CirclePictureSmall href={'/profile'} src={imageSrc} proportions={8}></CirclePictureSmall>
            <p className='truncate hover:cursor-pointer'>{session?.username}</p>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-6 right-3 mt-2 bg-[#363535] text-white shadow-lg rounded p-2 z-50 hover:cursor-pointer w-30">
                    <Link href={'/profile'} target="_blank" rel="noopener noreferrer"> 
                        <div className="px-4 py-2 text-sm hover:bg-gray-600">
                            Profile
                        </div>
                    </Link>
                    <div className="px-4 py-2 text-sm hover:bg-gray-600" onClick={logoutUser}>Logout</div>
                </div>
            )}
        </div>
    )
}