// lib/wrappers/withValidation.ts

import { ZodSchema, ZodError } from 'zod';

type Handler<T> = (data: T) => Promise<any>;

export function withValidation<T>(handler: Handler<T>, schema?: ZodSchema<T>) {
	//* It is like this function was already validating the data through the schema.To know what I mean:
	//! Go to the schemas and modify "createRoomSchema" to isPrivate: z.boolean({required_error: 'isPrivate is required.'}).default(false) ⬅️⬅️⬅️
	//! then check room-actions.ts

	return async (data: T) => {
		try {
			if (schema) {
				schema.parse(data);
			}

			return await handler(data);
		} catch (e) {
			if (process.env.NODE_ENV !== 'test') {
				console.log(e);
				console.log('Error in wrapper function:');
			}

			if (e instanceof ZodError) {

				if (process.env.NODE_ENV !== 'test') {
					console.log(e);
					console.log('Error in withValidation:');
				}

                //! Gave me some issues with image validation but you might use it back
				// const msg = Object.values(e.flatten().fieldErrors).flat()[0] || 'Invalid input';
				// return { success: false, msg };

                //* New, simpler, and apparently better one.
                const errorMessages = e.issues.map(issue => issue.message);
                const msg = errorMessages[0] || 'Invalid input';
                
                return { success: false, msg };
			}

			return {
				success: false,
				msg: (e as any)?.message || 'Internal server error',
			};
		}
	};
}
