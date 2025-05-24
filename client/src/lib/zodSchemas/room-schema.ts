import { z } from 'zod'


export const createRoomSchema = z.object({
        roomName: z.string({required_error: 'Room name is required.'}).min(3, {message: 'Room name must be at least 3 characters.'}).nonempty({message: 'Room name is required.'}).max(50, {message: 'Room name must be at most 100 characters.'}),
        isPrivate: z.boolean({required_error: 'isPrivate is required.'})
})

// export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>['body']

export const loadRoomContentsSchema = z.object({
    params: z.object({
        id: z.string({required_error: 'Room id is required.'}).nonempty('Room id is required.').uuid('Invalid room id.')
    })
})

export type LoadRoomContentsSchemaType = z.infer<typeof loadRoomContentsSchema>['params']