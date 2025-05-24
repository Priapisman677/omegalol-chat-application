import { getRoomMeta } from "@/actions/room-actions/get-room-meta"
import { NextRequest, NextResponse } from "next/server"

type Props = {
    params: Promise<{
        roomId: string
    }>
}

export const GET = async(_req: NextRequest, {params}: Props)=>{

    const {roomId} = await params

    const roomMeta: RoomMeta | null = await getRoomMeta(roomId)

    if(!roomMeta){
        return new NextResponse('', {
            status: 404
        })
    }

    return NextResponse.json(roomMeta)
}

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '50mb', // Adjust as needed
      },
    },
  };