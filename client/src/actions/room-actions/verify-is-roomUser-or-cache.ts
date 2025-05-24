"use server"

import { prisma } from "@/lib/db";
import { client } from "@/lib/redis-clients";
import { cacheUsersInRoomKey } from "@shared/keys/rooms-keys";

export const verifyIsRoomUserOrCache = async (userId: string, roomId: string) => {
	const role = (await client.hGet(cacheUsersInRoomKey(roomId), userId)) as | 'admin' | 'member'| 'invited' | null;

	if (role) {
		return { role: role };
	} else {
		const isMemberPrisma = await prisma.roomUser.findFirst({
			where: {
				userId: userId,
				roomId: roomId,
			},
		});

		if (isMemberPrisma) {
			// ! It is important that you wrap userId in "[]" because if not you'll set something like:
			// {userId: 'admin}
			// ! instead of {abc123: 'admin'}               ⬇️⬇️⬇️
			await client.hSet(cacheUsersInRoomKey(roomId), {[userId]: isMemberPrisma.role,})

			return { role: isMemberPrisma.role };
		} else {
			return { role: null };
		}
	}
};
