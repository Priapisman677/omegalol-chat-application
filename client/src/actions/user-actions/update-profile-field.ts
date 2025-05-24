'use server';

import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { withValidation } from '../wrapper-validator';
import {  updateSchema } from '@/lib/zodSchemas/user-schemas';
import { client } from '@/lib/redis-clients';
import { userJSONkey } from '@shared/keys/user-keys';

type UpdateField = 'username' | 'country' | 'gender' | 'bio';

const _updateProfileField = async ({value, updateField}: {value: string, updateField: UpdateField}) => {

	//% I wasn't able to manage custom fields with Zod because you need to pass a generic schema to the wrapper function.
	if (updateField === 'username') {
		if (value.length > 36) return { success: false, msg: 'Username must be at most 36 characters.' };
	}

	if (updateField === 'bio') {
		if (value.length > 100) return { success: false, msg: 'Bio must be at most 100 characters.' };
	}

	const headerStore = await headers();

	const userId = headerStore.get('userId');

	if (!userId) {
		//! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
		return { success: false, msg: 'User not found.' };
	}

	const user = await prisma.user.findFirst({
		where: { id: userId },
	});

	if (!user) return { success: false, msg: 'User not found.' };

	await prisma.user.update({
		where: { id: userId },
		data: {
			[updateField]: value,
		},
	});

	if(updateField === 'username'){
		client.json.set(userJSONkey(userId), '$.data.username', value)
	}

	return { success: true, msg: 'Success' };
};

export const updateProfileField: (data: {value: string, updateField: UpdateField}) => Promise<ActionResponse> = withValidation(_updateProfileField, updateSchema);
