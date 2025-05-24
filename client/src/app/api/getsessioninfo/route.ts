import { findUserById } from "@/lib/findUserById"
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"


export const GET = async(_request: NextRequest)=>{


    const cookieStore = await cookies();

    const cookie = cookieStore.get('SERVER_TOKEN')?.value;

    const id = await verifySession(cookie)
    
    try{

        if(!id){
            return new NextResponse(JSON.stringify({message:'Unauthorized'}), {
                status: 401
            })
        }

        const user = await findUserById(id)
        if(!user){
            return new NextResponse(JSON.stringify({message:'Unauthorized'}), {
                status: 401
            })
        }
        
    
        return new NextResponse(JSON.stringify({message:'success', data:{
            id: user.id,
            username: user.username
        }}))
        
    }catch(e){

        console.log(e);	
        
        return new NextResponse(JSON.stringify({message:'error'}), {
            status: 500
        })
    }


}