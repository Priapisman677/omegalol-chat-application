import { matchMakingListKey } from "@shared/keys/matchmaking-keys.js"
import { WatchError } from "redis"
import { Namespace, Socket } from "socket.io"
import { client } from "src/lib/redis-clients.js"
import crypto from 'node:crypto'
import { usersInRandomRoom } from "@shared/keys/rooms-keys.js"
type MatchedUserMessage = {success: boolean, message: string, matchedUserId?: string}

//prettier-ignore
export const onFindMatch = async(socket1: Socket, namespace: Namespace)=>{
    const result: MatchedUserMessage = await client.executeIsolated(async (isoClient)=>{
        let count = 0
        while(count < 5){
            count ++
            try{
                await isoClient.watch(matchMakingListKey())
                const usersWaiting = await isoClient.lLen(matchMakingListKey()) //* Before stopping with Multi, we query
                if (usersWaiting === 0) {
                    const tx = isoClient.multi()

                    tx.lRem(matchMakingListKey(), 0,  socket1.id) // $If it is not the first iteration, this will prevent the socket from being inserted multiple times.
                    tx.rPush(matchMakingListKey(), socket1.id)
                    await tx.exec()
                    return { success: true, message: 'No users waiting, placed in queue' }
                } else{
                    const tx = isoClient.multi()
                    tx.lPop(matchMakingListKey())
                    const [matchedUserId] = await tx.exec()
                    return { success: true, matchedUserId, message: 'Match found' } as MatchedUserMessage
                }
            }catch(e){
                if(e instanceof WatchError) continue
                console.error(e); 
                return { success: false, message: 'Something went wrong, see the log.' }
            }
        }
        return { success: false, message: 'Error: 5th watch error' } //* This should never happen unless you hit a 5th watch error.
    })

    if(!result.success){
        socket1.emit('error-event', result as MatchedUserMessage)
        return
    }

    if(!result.matchedUserId){
        socket1.emit('placed-in-queue', result.message)
        return
    }
    
    const socket2 = namespace.sockets.get(result.matchedUserId as string)
    
    if(!socket2){
        await onFindMatch(socket1, namespace) //*  If for any reason the search is successful, but the socket is not found, we try again
        return
    }
    const roomId = crypto.randomUUID()

    const socketsArray = [socket1, socket2]

    for (const socket of socketsArray) {
        socket.data.matchRoom = roomId
        socket.join(roomId)
        await client.hSet(usersInRandomRoom(roomId), {[socket.id]: socket.user?.id || ''})
    }
    
    namespace.to(roomId).emit('match-found', roomId, 'Match found')
    
    socket1.emit('receive-stranger-info', {
        socketId: socket2.id, 
        userId: socket2.user?.id || null
    })
    socket2.emit('receive-stranger-info', {
        socketId: socket1.id, 
        userId: socket1.user?.id || null
    } as StrangerInfoPayload)


    

}