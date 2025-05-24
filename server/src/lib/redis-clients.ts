import chalk from 'chalk';
import {createClient, RedisClientType} from 'redis'
import { privateChatIo } from 'src/sockets-setup.js';
import { onKick } from 'src/sockets/namespaces/private-chat/controllers/on-kick.js';

if(!process.env.REDIS_PORT || !process.env.REDIS_HOST){
    throw new Error('REDIS_PORT is not defined')
}

export const client = createClient({
    socket :  {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    },
    password:  ''
})
client.on('connect', ()=>{
    console.log(chalk.inverse.green('Client connected to redis'));
})

await  client.connect()




const kickUserSubscriber = createClient({
    socket :  {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    },
    password:  ''
})

await kickUserSubscriber.connect()

await kickUserSubscriber.subscribe('kick-user', async (msg: string)=>{ //% it's a stringified JSON.
    await onKick(privateChatIo, client as RedisClientType,  msg)

})