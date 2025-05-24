"use server"

import { withValidation } from "../wrapper-validator";
import fs from "node:fs/promises";
import crypto from 'node:crypto'
import {headers} from 'next/headers'
import { prisma } from "@/lib/db";
import { profileRoomPictureSchema } from "@/lib/zodSchemas/file-schema";
import { client } from "@/lib/redis-clients";
import { userJSONkey } from "@shared/keys/user-keys";


const _uploadProfilePic = async(file: File)=>{
    const headerStore = await headers()

    const userId = headerStore.get('userId')

    if(!userId){
        //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
        return { success: false, msg: 'User not found.' };
    }
    
    // * Save to public
    fs.mkdir('media/profile-pics', {recursive: true})

    
    const bytes = new Uint8Array (await file.arrayBuffer()) // "Buffer.from(<>)" would also work.
    
    const path = 'media/profile-pics/' + crypto.randomUUID() + '-' + file.name
    await fs.writeFile(path, bytes)

    await prisma.user.update({
        where:{id: userId},
        data: {
            profilePicPath: path
        }
    })

    client.json.set(userJSONkey(userId), '$.data.profilePicPath', path)

    return { success: true, msg: 'Success'}
}

export const uploadProfilePic : (data: File) => Promise<ActionResponse> = withValidation(_uploadProfilePic, profileRoomPictureSchema)


