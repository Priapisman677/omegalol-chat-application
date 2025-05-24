"use server"

import { findUserById } from "@/lib/findUserById";
import { headers } from "next/headers";



export const getUserInfo = async (userId?: string) => {
    //% This gets called in the session context AND in the layout server-side.


    if(!userId){
        const headerStore = await headers()
        userId = headerStore.get('userId') || undefined
    
        if(!userId){
            //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
            return null;
        }

    }

    const rawUserInfo = await findUserById(userId)
    
    if(!rawUserInfo) return null;
    

    const userInfoNoHash = {
        id: rawUserInfo.id,
        username: rawUserInfo.username,
        email: rawUserInfo.email,
        profilePicPath: rawUserInfo.profilePicPath,
        countryCode: rawUserInfo.country,
        gender: rawUserInfo.gender,
        bio: rawUserInfo.bio
    }
    return userInfoNoHash
}


