import { Socket } from 'socket.io';
import { prisma } from 'src/lib/db.js';
import { handleBlobMessage } from 'src/sockets/handle-blob-message.js';

//prettier-ignore
export const onSendMessage = async ( socket: Socket, payload: ClientPrivateMessage, roomName: string,
	cb: ({ error }: { error: string | null }) => void
) => {

	if (payload.messageType === 'text') {
		socket.to(roomName).emit('receive-message', payload);
        const identifier = socket.user ? socket.user?.id : payload.identifier
        const userId = socket.user ? socket.user.id : 'CONSTRUCTOR'

        await prisma.message.create({
            data: {
                identifier,
                messageType: 'text',
                roomId: 'GLOBAL',
                userId,
                textContent: payload.textContent,
            }
        })

        cb({error: null})

	}else if (payload.messageType === 'file' && payload.bytes) {
        const result = handleBlobMessage( payload);

        if(!result.success){
            cb({error: result.message})
            return
            
        }
        socket.to(roomName).emit('receive-message', payload);
		cb({error: null})

        const identifier = socket.user ? socket.user?.id : payload.identifier
        const userId = socket.user ? socket.user.id : 'CONSTRUCTOR'


        console.log({
            type: typeof payload.bytes,
            constructor: payload.bytes?.constructor?.name,
            isBuffer: Buffer.isBuffer(payload.bytes),
            isUint8Array: payload.bytes instanceof Uint8Array
        });
        

        await prisma.message.create({
            data: {
                identifier,
                userId,
                messageType: 'file',
                roomId: 'GLOBAL',
                fileName: payload.fileName,
                fileUrl: null,
                bytes: payload.bytes
            }
        })

        console.log(await prisma.message.findMany({
            where: {
                roomId: 'GLOBAL'
            }
        }));


	return;
        
    }

};
