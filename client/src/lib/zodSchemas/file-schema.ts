
import { z } from 'zod';

//$ In "refine" we return true if the file is valid.

const fileRefiner = (file: File) => {
	console.log('validating file');

	return file.size > 0;
};

const fileSchema = z
	.instanceof(File, { message: 'File required!' })
	.refine(fileRefiner, { message: 'File required!' });

const profileRoomPictureRefiner = (file: File) => {
	return file.type.startsWith('image/') && file.size < 5 * 1024 * 1024; // 5MB
};

export const profileRoomPictureSchema = fileSchema.refine(profileRoomPictureRefiner, {
	message: 'File must be an image and less than 5MB.',
});

const messageFileRefiner = (file: File) => {
	return file.type.startsWith('image/') && file.size < 10 * 1024 * 1024; // 10MB
};

export const messageFileSchema = z.object({
	file: fileSchema.refine(messageFileRefiner, {
		message: 'File must be an image and less than 5MB.',
	}),
	payload: z.object({
		messageType: z.literal('file'),
		username: z.string(),
		roomId: z.string(),
		userId: z.string(),
		profilePicPath: z.string().nullable(),
		timeStamp: z.date(),
		identifier: z.string(),
		bytes: z.instanceof(Uint8Array).nullable(),
		countryCode: z.string().nullable(),
		gender: z.enum(['male', 'female', 'unknown']).nullable()
	})
});

export const uploadRoomPicSchema = z.object({
	roomId: z.string().uuid('Invalid room id.'),
	file: profileRoomPictureSchema

})