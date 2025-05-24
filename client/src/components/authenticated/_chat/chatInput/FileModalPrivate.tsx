import { saveFileMessage } from "@/actions/user-actions/save-file-message";
import SharedFileModalElement from "@/components/shared/SharedFileModalElement";
import { useSocket } from "@/context/generic-socket-context";
import { useRoomContext } from "@/context/RoomContext";
import { useSession } from "@/context/session-context";

type FileModalProps = {
	file: File | null;
	insertMessage: (message: ClientPrivateMessage) => void;
	handleCloseModal: () => void;
};
//prettier-ignore
export function FileModalPrivate({ file,  insertMessage, handleCloseModal }: FileModalProps) {
	if (!file) return null;

    const socket = useSocket()
    const {session} = useSession()
    const {roomMeta} = useRoomContext()
    const handleFileSubmit = async () => {
        if (!file) return;

        const inputMessage: ClientPrivateFileMessageBeforeSend = {
            messageType: 'file',
            username: session!.username,
            roomId: roomMeta!.id,       //? Consider that all these properties could be modified from the user.You could send dummy bowl use and insert the correct ones in the server.
            userId: session!.id,
            profilePicPath: session!.profilePicPath,
            timeStamp: new Date(),
            identifier: session!.id,
            countryCode: session!.countryCode,
            gender: session!.gender,
            bytes: null
        };
        const result: SendFileActionResponse = await saveFileMessage({payload: inputMessage, file})
        if (!result.success) {
            alert(result.msg)
            return
        }
        handleCloseModal()

        const outBoundMessage =  {
            ...inputMessage,
            fileUrl: result.fileUrl, 
            fileName: result.fullFileName
        } as ClientPrivateFileMessageWhenReceived

        insertMessage(outBoundMessage);
        socket.emit('send-message', outBoundMessage);
    };

	const url = URL.createObjectURL(file);

	return (
		<SharedFileModalElement handleCloseModal={handleCloseModal} handleFileSubmit={handleFileSubmit} url={url}></SharedFileModalElement>
	);
}
