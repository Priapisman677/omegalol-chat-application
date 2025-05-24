import { addIdToRoom } from "@/actions/room-actions/add-id-to-room"
import { prisma } from "@/lib/db"
import { client } from "@/lib/redis-clients"
import { cacheUsersInRoomKey } from "@shared/keys/rooms-keys"

const userId = '#abc'
const roomId = 'hk12'
beforeAll(async ()=>{


    await prisma.user.deleteMany({}) //! Important because it might conflict with other tests such as addIdtoRoom.test.ts

    await prisma.user.upsert({
        create: {
            email: 'asd@asd.lo',
            hash: 'asda',
            username: 'asdad',
            id: userId
        },
        update: {},
        where: {
            id: userId
        }
    })

    await prisma.room.upsert({
        create: {
            createdById: userId,
            roomName: 'backroom',
            isPrivate: false,
            id: roomId
        },
        update: {},
        where: {
            id: roomId
        }
    })

    await prisma.roomUser.deleteMany({})

    await client.del(cacheUsersInRoomKey(roomId))
})


afterAll(async ()=>{
    //! This might help avoid parallelism issues between tests, especially the ones that depend on Prisma.
    await prisma.roomUser.deleteMany({})
})


test('Should add the correct userRoom', async ()=>{
    await addIdToRoom(userId, roomId)

    const userRoom = await prisma.roomUser.findFirst({
        where: {
            userId,
            roomId
        }
    })

    expect(userRoom).not.toBeNull()
    expect(userRoom?.role).toBe('member')
    expect(userRoom?.userId).toBe(userId)
    expect(userRoom?.roomId).toBe(roomId)

})

test('Should not add the same userRoom twice', async ()=>{
    await addIdToRoom(userId, roomId)
    expect(await addIdToRoom(userId, roomId)).toEqual({success: false, msg: 'User already in room.'})
})