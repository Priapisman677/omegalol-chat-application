import SharedFileModalElement from "../shared/SharedFileModalElement";
import { useSocket } from "@/context/generic-socket-context";
import { useSession } from "@/context/session-context";


type FileModalProps = {
    file: File | null;
    insertMessage: (message: ClientPrivateMessage) => void;
    handleCloseModal: () => void;
};
//prettier-ignore
export function FileModalRandom( { file, insertMessage, handleCloseModal }: FileModalProps) {
    if (!file) return null;
    const socket = useSocket()
    const {session} = useSession()
    
    
    const handleFileSubmit = async () => {
            if (!file) return;
            const bytes = Buffer.from(await file.arrayBuffer())

            handleCloseModal()
    
            const outBoundMessage: ClientPrivateFileMessageWhenReceived =  {
                messageType: 'file',
                username: session?.username || null,
                roomId: (socket as any)?.data?.matchRoom || 'randomroom',
                userId: session?.id || null,
                profilePicPath: session?.profilePicPath || null,
                timeStamp: new Date(),
                fileUrl: null,
                fileName: file.name,
                fileType: file.type,
                bytes,
                identifier: session?.id || socket.id!,
                countryCode: session?.countryCode || null,
                gender: session?.gender || null
            } 
    
            socket.emit('send-message', outBoundMessage, ({error}: {error: string | null}) => {
                if (error) {
                    insertMessage({
                        messageType: 'event',
                        textContent: error,
                        userId: 'event-user',
                        timeStamp: new Date(),
                        roomId: (socket as any)?.data?.matchRoom || 'randomroom',
                        profilePicPath: null,
                        username: 'red', //* Determines the color of the message
                        identifier: 'event',
                        countryCode: null,
                        gender: null
                    })
                    return
                }
                insertMessage(outBoundMessage);
            });
        };


    const url = URL.createObjectURL(file);
 
    return (
        <SharedFileModalElement handleCloseModal={handleCloseModal} handleFileSubmit={handleFileSubmit} url={url}></SharedFileModalElement>
    );
}
