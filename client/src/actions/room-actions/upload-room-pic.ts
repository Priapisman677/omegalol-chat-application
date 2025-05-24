"use server"

import { headers } from "next/headers";
import { withValidation } from "../wrapper-validator";
import fs from "node:fs/promises";
import crypto from 'node:crypto'
import { prisma } from "@/lib/db";
import { uploadRoomPicSchema } from "@/lib/zodSchemas/file-schema";


const _uploadRoomPic = async({file, roomId}: {file: File, roomId: string}): Promise<ActionResponse>=>{
    const headerStore = await headers()

    const userId = headerStore.get('userId')

    if(!userId){
        //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
        return { success: false, msg: 'User not found.' };
    }


    const relation = await prisma.roomUser.findFirst({
        where: {
            userId,
            roomId,
            role: 'admin'
        }
    })

    if(!relation){
        return { success: false, msg: 'Unauthorized'}
    }
    
    await fs.mkdir('media/room-pics', {recursive: true})

    const bytes = new Uint8Array(await file.arrayBuffer())

    const fullFileName = crypto.randomUUID() +'-' + file.name

    
    const path  = 'media/room-pics/' + fullFileName
    
    await fs.writeFile( path, bytes)

    await prisma.room.update({
        where: {id: roomId},
        data: {
            roomPicPath: path
        }
    })


    return { success: true, msg: 'Success'}


}



export const uploadRoomPic : (data: { file: File; roomId: string }) => Promise<ActionResponse> = withValidation(_uploadRoomPic, uploadRoomPicSchema)
