import { getOnlineUsersInRoomNumber } from '@/actions/redis-actions/get-online-users-number';
import { addIdToRoom } from '@/actions/room-actions/add-id-to-room';
import { getRoomMessages } from '@/actions/room-actions/get-room-messages';
import { getRoomMeta } from '@/actions/room-actions/get-room-meta';
import { verifyIsRoomUserOrCache } from '@/actions/room-actions/verify-is-roomUser-or-cache';
import { getUserInfo } from '@/actions/user-actions/get-user-info';
import ChatWindow from '@/components/authenticated/_chat/ChatWindow';
// import Home from '@/components/authenticated/_chat/Home';
import {RoomProvider} from '@/context/RoomContext';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';


interface Props {
	params: Promise<{ roomId: string }>;
}

export default async function Chat({ params }: Props) {
	const { roomId } = await params;
	
	
	const user = await getUserInfo();
	const roomMeta: RoomMeta | null = await getRoomMeta(roomId);

	if (!roomMeta || !user) return <p> Something went wrong :(</p>;

	let {role} = await verifyIsRoomUserOrCache(user.id, roomId)

	if(!role){
		if(roomMeta.isPrivate){
			if(!role) redirect('/chat');
			return
		}else {//* If the room is PUBLIC.
			role = 'member' 
			await addIdToRoom(user.id, roomId)
		}
	}else if (role === 'invited') {
		await addIdToRoom(user.id, roomId)
		role = 'member' // This is for the room provider.
	}


	const usersOnline = await getOnlineUsersInRoomNumber(roomId);

	await prisma.roomUser.update({    //* This is for setting messages to 0 when visiting the room
		where: {
			userId_roomId: {
				roomId,
				userId: user.id
			}
		},
		data: {
			unReadMessages: 0
		}
	})


	const reversedMessages: GetRoomMessagesActionResponse = await getRoomMessages(roomId)

	if(!reversedMessages.success){
		console.error(reversedMessages.msg)
		return
	}

	const messages = reversedMessages.messages.reverse()

	//prettier-ignore
	return (
		<>
			<RoomProvider roomId={roomId} initialRoomMeta={roomMeta} role={role}>
				<ChatWindow usersOnline={usersOnline} roomId={roomId} initialMessages={messages} />
			</RoomProvider>
		</>
	);
}
