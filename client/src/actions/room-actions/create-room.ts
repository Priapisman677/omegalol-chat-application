"use server";


import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { withValidation } from '../wrapper-validator';
import { createRoomSchema } from '@/lib/zodSchemas/room-schema';


// prettier-ignore
const _createRoom = async ({roomName, isPrivate}: {roomName: string, isPrivate: boolean}) => {

    const headerStore = await headers()
    const userId = headerStore.get('userId')

    if(!userId){
        //! This check might be USELESS because it is supposed that if there is no cookie the request would have been stopped in the middleware.
        return { success: false, msg: 'User not found.' };
    }


    const room = await prisma.room.create({
        data: {
            createdById: userId,
            roomName,
            isPrivate

        }
    })

    await prisma.roomUser.create({
        data:{
            userId,
            roomId: room.id,
            role: 'admin',
            unReadMessages: 0
        }
    })
    return { success: true, msg: 'Success' , room};
};

//prettier-ignore
export const createRoom: (data: CreateRoomPayload)=> Promise<CreateRoomActionResponse> = withValidation(_createRoom, createRoomSchema)