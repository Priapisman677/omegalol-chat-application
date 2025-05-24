import { z } from 'zod';

export const changeUsernameSchema = z
	.string({ required_error: 'Username is required.' })
	.min(3, 'Username must be at least 3 characters.')
	.nonempty('Username is required.')
	.max(36, 'Username must be at most 36 characters.');

export const signupSchema = z.object({
	username: changeUsernameSchema,
	email: z
		.string({ required_error: 'Email is required.' })
		.email('Invalid email')
		.nonempty('Email is required.'),
	password: z
		.string({ required_error: 'Password is required.' })
		.min(6, 'Password must be at least 6 characters long.')
		.nonempty('Password is required.'),
	image: z.string().optional(),
});

export const logInSchema = z.object({
	email: z.string().email('Invalid email.'),
	password: z.string().nonempty('Password is required.'),
});

export const updateSchema = z.object({
	value: z
		.string({ required_error: 'Update is required.' })
		.min(1, 'Update must be at least 3 characters.'),
	//   .max(36, 'Username must be at most 36 characters.'),  //% I will use javascript to check for the update length because it depends on the update field.

	updateField: z.enum(['username', 'country', 'gender', 'bio'], {
		required_error: 'Update field is required.',
	}),
});
