import { getRoomMessages } from "@/actions/room-actions/get-room-messages";
import ChatWindowGlobal from "@/components/Global/ChatWindowGlobal";

export default async function Global() {

    const reversedMessages: GetRoomMessagesActionResponse = await getRoomMessages('GLOBAL', 20)

	if(!reversedMessages.success){
		console.error(reversedMessages.msg)
		return
	}

	const messages = reversedMessages.messages.reverse()


    return (
        <ChatWindowGlobal initialMessages={messages}></ChatWindowGlobal>
    )
}