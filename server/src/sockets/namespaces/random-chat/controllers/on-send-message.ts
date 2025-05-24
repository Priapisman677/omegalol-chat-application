import { Socket } from 'socket.io';
import { handleBlobMessage } from 'src/sockets/handle-blob-message.js';


//prettier-ignore
export const onSendMessage = async (
	socket: Socket,
	payload: ClientPrivateMessage,
	cb: ({error}: {error: string | null}) => void
) => {
	console.log({ payload });

	if (payload.messageType === 'text') {
		socket.to(socket.data.matchRoom).emit('receive-message', payload);
        cb({error: null})
	} else if (payload.messageType === 'file' && payload.bytes) {
		const result = handleBlobMessage(payload);

		if (!result.success) {
			cb({error: result.message});
			return;
		}

		socket.to(socket.data.matchRoom).emit('receive-message', payload);
		cb({error: null})
	}
};
