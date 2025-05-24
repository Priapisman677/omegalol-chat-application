import { Namespace } from "socket.io"
import { prisma } from "src/lib/db.js"




export const sendAndSaveEvent = async(namespace: Namespace, color: ('red' | 'green' | 'gray'), roomId: string, textContent: string)=>{
    namespace.to(roomId).emit('receive-event', {
        username: color,
        messageType: 'event',
        userId: 'event-user',
        profilePicPath: null,
        timeStamp: new Date(),
        roomId,
        textContent: textContent
    } as EventMessage)

    await prisma.message.create({
        data: {
            messageType: 'event',
            identifier: 'event',
            textContent,
            roomId,
            userId: 'CONSTRUCTOR'
        }
    })


    return
}