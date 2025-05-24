import { matchMakingListKey } from "@shared/keys/matchmaking-keys.js"
import { Socket } from "socket.io"
import { client } from "src/lib/redis-clients.js"

export const onStopSearch = async (socket: Socket)=>{

    await client.lRem(matchMakingListKey(), 0, socket.id)

    return
}