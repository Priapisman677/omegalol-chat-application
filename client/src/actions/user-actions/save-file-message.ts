"use server"

import fs from "node:fs/promises"
import crypto from "node:crypto"
import { headers } from "next/headers"
import { withValidation } from "../wrapper-validator"
import { messageFileSchema } from "@/lib/zodSchemas/file-schema"
import { prisma } from "@/lib/db"
import { client } from "@/lib/redis-clients"
import { userRoomsKey } from "@shared/keys/user-keys"



const _saveFileMessage = async({ payload, file }: {
    payload: ClientPrivateFileMessageBeforeSend
    file: File
})=>{
    
    const headerStore = await headers()
    
    const userId = headerStore.get('userId')
    
    const isInRoom = await client.sIsMember(userRoomsKey(userId!), payload.roomId || '')
    if(!isInRoom) return {success: false, msg: 'You are not allowed to send messages in this room'}
    
    await fs.mkdir('media/message-files', {recursive: true})

    const fullFileName = crypto.randomUUID() + '-' + file.name

    const filePath = 'media/message-files/' +  fullFileName

    const bytes = new Uint8Array(await file.arrayBuffer())

    await fs.writeFile(filePath, bytes)


    await prisma.message.create({
         //$ Timestamp gets saved automatically.
        data: {
            messageType: payload.messageType,
            roomId: payload.roomId!,
            userId: userId!,
            fileName: fullFileName,
            fileUrl: filePath,
            mimeType: file.type,
            size: file.size,
            identifier: userId!,
        }
    })


    return {success: true, msg: 'Success', fullFileName, fileUrl: filePath}
}


                                //! Careful  here, I placed "any" just for the type  error of username being possibly null from random messages.
                                //! It is the validator itself that will take care of rejecting them if they don't have username.
                                //!It is just detecting that from my own function I can pass nullable usernames.
export const saveFileMessage: ({payload, file}: {payload: any, file: File})=> Promise<SendFileActionResponse> = withValidation(_saveFileMessage, messageFileSchema)
