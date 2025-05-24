import { prisma } from "@/lib/db";

export const findUserById = async (userId: string) => {

    
    if (!userId) {
        return null;
    }
    
    const userInfo = await prisma.user.findFirst({
        where : {
            id: userId
        }
    })
    
    if (!userInfo) {
        //! DO NOT DELETE THE COOKIE HERE BECAUSE THE LAYOUT RENDERING CANNOT HANDLE THAT
        return null;
    }

    return userInfo
}
