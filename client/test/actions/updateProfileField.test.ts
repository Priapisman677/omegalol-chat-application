import { updateProfileField } from "@/actions/user-actions/update-profile-field"
import { prisma } from "@/lib/db"
import { client } from "@/lib/redis-clients"
import { userJSONkey } from "@shared/keys/user-keys"

const userId = '#abc323'


const getMock = jest.fn()

jest.mock('next//headers', ()=>{
    return {
        __esModule: true,
        headers: ()=>{
            return {
                get:  getMock
            }
        }
    }
})


beforeAll(async ()=>{

    await prisma.user.deleteMany({}) //! Important because it might conflict with other tests such as addIdtoRoom.test.ts

    await prisma.user.upsert({
        create: {
            email: 'asd@asdlol.lo',
            hash: 'asda',
            username: 'asdad',
            id: userId
        },
        update: {},
        where: {
            id: userId
        }
    })

    getMock.mockReturnValue('#abc323')


})

afterAll(async ()=>{
    await new Promise((r) => setTimeout(r, 1000));

    await client.flushAll()
    await prisma.user.deleteMany({})
})


test('Should update username', async () => {

    await client.json.set(userJSONkey(userId), '$', {
        userId,
        data: {
            username: 'oldUsername'
        }
    })

    const res = await updateProfileField({value: 'newUsername', updateField: 'username'})
    expect(res).toEqual({success: true, msg: 'Success'})

    const user = await prisma.user.findFirst({where: {id: userId}}) //! Redis JSON needs to be prepared from root.

    expect(user?.username).toBe('newUsername')
    

})

test('Should not update username if too short', async () => {
    const res = await updateProfileField({value: '', updateField: 'username'})
    expect(res).toEqual({success: false, msg: 'Value must be at least 1 character.'})
})

test('Should not update username if too long', async () => {
    const res = await updateProfileField({value: 'a'.repeat(101), updateField: 'username'})
    expect(res).toEqual({success: false, msg: 'Username must be at most 100 characters.'})
})