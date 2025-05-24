import { ZodError } from "zod";
import { TextMessageSchema } from "../zodSchemas/message-schema.js";
import { prisma } from "./db.js";
import { client } from "./redis-clients.js";
import { userRoomsKey } from "@shared/keys/user-keys.js";

export const saveTextMessage = async(payload: ClientPrivateTextMessage, userId: string)=>{

    const isInRoom = await client.sIsMember(userRoomsKey(userId), payload.roomId)


    if(!isInRoom) return {success: false, msg: 'You are not allowed to send messages in this room'}
    

    try{
        const {roomId, textContent, messageType } = TextMessageSchema.parse(payload)

        //$ Timestamp gets saved automatically.
        await prisma.message.create({
            data: {
                roomId,
                textContent,
                messageType,
                userId: userId,
                identifier: userId
            }
        })
        return {success: true, msg: 'success'} 
    } catch(e){
        if(e instanceof ZodError){    
            console.log(e);
            const msg= Object.values(e.flatten().fieldErrors).flat()[0] || "Invalid input"
            return {success: false, msg} 
        }
        return {success: false, msg: e}
    }

}