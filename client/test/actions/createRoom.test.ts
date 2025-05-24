import { createRoom } from "@/actions/room-actions/create-room"
import { prisma } from "@/lib/db"


const getMock = jest.fn()
const userId = '#AK6L227D'

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

beforeEach( async ()=>{
    await prisma.room.deleteMany({
        where: {
            createdById: userId
        }
    })
    await prisma.user.upsert({
        where: {
            id: userId
        },        
        update: {},
        create: {
            id: userId,
            email: 'noEdit@gmail.com',
            username: 'test',
            hash: 'test'
        }
    })
})



test('should create room and roomUser', async () => {
    getMock.mockReturnValue(userId); 
    const data: CreateRoomActionResponse = await createRoom({roomName: 'test', isPrivate: false})
    
    expect(getMock).toHaveBeenCalledWith('userId')
    expect(data.room).toBeTruthy();

    const roomUser = prisma.roomUser.findFirst({
        where: {
            roomId: data.room?.id,
            userId,
            role: 'admin'
        }
    })

    expect(roomUser).toBeTruthy()

    
})

test('should reject if no UserId', async () => {
    getMock.mockReturnValue(null); 
    const data: CreateRoomActionResponse = await createRoom({roomName: 'test', isPrivate: false})
    
    expect(getMock).toHaveBeenCalledWith('userId')
    expect(data.success).toBe(false)
})