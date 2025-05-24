import { deleteUserFromRoom } from "@/actions/room-actions/delete-user-from-room"
import { prisma } from "@/lib/db"
import { client } from "@/lib/redis-clients"
import { cacheUsersInRoomKey, connectedUsersInRoomKey } from "@shared/keys/rooms-keys"
import { userRoomsKey } from "@shared/keys/user-keys"


const user1Id = 'abc123'
const user2Id = '123abc'

const roomId = 'asbasd'

const getMock = jest.fn()
jest.mock('next/headers', ()=>{
    return {
        __esModule: true,

        headers: ()=>{
            return {
                get: getMock
            }
        }
    }
})


beforeEach(async () => {

    await prisma.roomUser.deleteMany({})

    await prisma.roomUser.upsert({
        create: {
            userId: user1Id,
            roomId: roomId,
            role: 'admin'
        },
        where: {
            userId_roomId: {
                userId: user1Id,
                roomId: roomId
            }
        },
        update: {}
    })
    
    await prisma.roomUser.upsert({
        create: {
            userId: user2Id,
            roomId: roomId,
            role: 'member'
        },
        where: {
            userId_roomId: {
                userId: user2Id,
                roomId: roomId
            }
        },
        update: {}
    })

    await client.hSet(cacheUsersInRoomKey(roomId),{[user2Id]: 'member'})
    await client.sAdd(connectedUsersInRoomKey(roomId), user2Id) //*Assuming user entered the room at some point 
    await client.sAdd(userRoomsKey(user2Id!), roomId) //*Assuming user entered the room at some point 
})





beforeAll( async ()=>{


    // await new Promise((r) => setTimeout(r, 1000));//! This might help avoid parallelism issues between tests, especially the ones that depend on Prisma.
    
    await prisma.user.deleteMany({}) //! Important because it might conflict with other tests such as addIdtoRoom.test.ts
    await prisma.roomUser.deleteMany({})

    const user1 = await prisma.user.upsert({
        create: {
            email: 'asd@asd.lo',
            hash: 'asda',
            username: 'asdad',
            id: user1Id
        },
        update: {},
        where: {
            id: user1Id
        }
    })
    await prisma.user.upsert({
        create: {
            email: 'asd@asd.lololl',
            hash: 'asda',
            username: 'asdad',
            id: user2Id
        },
        update: {},
        where: {
            id: user2Id
        }
    })

    await prisma.room.upsert({
        create: {
            createdById: user1.id,
            roomName: 'backroom',
            isPrivate: false,
            id: roomId
        },
        update: {},
        where: {
            id: roomId
        }
    })



})



test('Cookie should be checked', async ()=>{
    getMock.mockReturnValue(user1Id);

    await deleteUserFromRoom( user2Id, roomId )
    expect(getMock).toHaveBeenCalledWith('userId')
})

test('User should be admin', async ()=>{
    getMock.mockReturnValue(user2Id);

    const result = await deleteUserFromRoom( user1Id, roomId )
    expect(result).toEqual({success: false, msg: 'Unauthorized, not an admin.'})
})

test('User should be in room', async ()=>{
    getMock.mockReturnValue(user1Id);

    const result = await deleteUserFromRoom( 'other user', roomId )
    expect(result).toEqual({success: false, msg: 'User not in room.'})
})


test('User should be deleted', async ()=>{
    getMock.mockReturnValue(user1Id);

    const result = await deleteUserFromRoom( user2Id, roomId )
    expect(result).toEqual({msg: 'Success', success: true})

    //*Redis
    const roomUsers = await client.hGetAll(cacheUsersInRoomKey(roomId))
    expect(roomUsers).toEqual({})
    const connectedUsers = await client.sMembers(connectedUsersInRoomKey(roomId))
    expect(connectedUsers).toEqual([])
    const userRooms = await client.sMembers(userRoomsKey(user2Id!))
    expect(userRooms).toEqual([])
})

