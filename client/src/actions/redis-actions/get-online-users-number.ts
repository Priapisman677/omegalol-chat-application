"use server"

import { client } from '@/lib/redis-clients';

import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys';
import { globalActiveIPsKey } from '@shared/keys/user-keys';






export const getOnlineUsersInRoomNumber = async(roomId: string)=>{


	const onlineUsersNumber = await client.sCard(connectedUsersInRoomKey(roomId)) //$ N or 0

	return onlineUsersNumber
}

export const getOnlineGlobalSocketsCount = async()=>{

	const onlineUsersNumber = (await client.keys(globalActiveIPsKey('*'))).length //$ N or 0

	return onlineUsersNumber
}
