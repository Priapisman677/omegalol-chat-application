"use server"



import { prisma } from "@/lib/db";
import { createSession} from "@/lib/session";
import {  logInSchema} from "@/lib/zodSchemas/user-schemas";
import bcryptjs from "bcryptjs"
import { withValidation } from "../wrapper-validator";




const _logIn = async ( {email, password}: LogInPayload) => {
    const foundUser = await prisma.user.findFirst({
        where: { email },
    });

    if (!foundUser) {
        return { success: false, msg: 'User does not exist' };
    }

    const isValid = await bcryptjs.compare(password, foundUser.hash)

    if (!isValid) {
        return { success: false, msg: 'Invalid password' };
    }

    await createSession(foundUser.id)
    const { hash, ...user } = foundUser

    return {success: true, msg: 'User logged in successfully', user}
};

export const logIn: (data:LogInPayload)=>  Promise<LogInActionResponse> = withValidation(_logIn, logInSchema)