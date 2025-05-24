"use server"

import { prisma } from "@/lib/db"
import { client } from "@/lib/redis-clients"
import { createSession } from "@/lib/session"
import { userJSONkey } from "@shared/keys/user-keys"
import bcryptjs from "bcryptjs"
import { customAlphabet } from "nanoid"
import { withValidation } from "../wrapper-validator"
import { signupSchema } from "@/lib/zodSchemas/user-schemas"
// import { randomUUID, randomBytes } from "crypto"



//¡ export just for dev
export const _signUp =  async ({ username, email, password }: SignUpPayload) => {
    
    
    const existing = await prisma.user.findFirst({ where: { email } })
    if (existing) return { success: false, msg: "User already exists" }
    
    const hash = await bcryptjs.hash(password, 10)

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    const nanoid = customAlphabet(alphabet, 10)

    const id = '#' + nanoid()
    
    
    // if(username === 'a'){ email = randomBytes(10).toString('hex'); username = randomUUID() } ;     //¡ just for dev

    //* we call hash like "_" to avoid a conflict with previous hash. We don't need it.
    const { hash: _, ...user} = await prisma.user.create({
      data: { username, email, hash, id}
    })

    
    await createSession(user.id)


    //* Add to Redis
    const redisData: RedisJsonUserResult = {
        userId: user.id.replace('#', ''),
        data: {
            username: user.username,
            profilePicPath: null
        }
    }
    await client.json.set(userJSONkey(user.id), '$', redisData)


    
    return { success: true, msg: "User created", user }
}
export const signUp: (data: SignUpPayload) => Promise<SignUpActionResponse> = withValidation(_signUp, signupSchema)