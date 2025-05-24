import app from './express-setup.js';

import { Server } from 'socket.io';
import { createServer } from 'http';
import { middleWare } from './sockets/middleware.js';
import { onConnection as  onPrivateConnection} from './sockets/namespaces/private-chat/controllers/on-connection.js';
import { onConnection as onPassiveConnection } from './sockets/namespaces/passive/controllers/on-connection.js';
import { onConnection as onRandomConnection } from './sockets/namespaces/random-chat/controllers/on-connection.js';
import { onConnection as onGlobalConnection } from './sockets/namespaces/global/controllers/on-connection.js';
import { prisma } from './lib/db.js';


export const server = createServer(app);

//* Exporting io just for testing in Jest, not needed in reality.
export const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true,
	},

	//! Exceeding this limit totally disconnects the user socket and they would lose communication. Validate with Zod only instead.
	//!  DO NOT USE.
	//  maxHttpBufferSize:  5 * 100 * 1024, // 500kb
})

//- Most of the logic of authentication for sockets will not be used because to use sockets as a page requires authentication itself.
//- It is just an extra paranoic security measure lol.


//* P A S I V E
const passiveIo = io.of('/passive')
passiveIo.use(middleWare)
passiveIo.on('connection', (socket)=>{
	onPassiveConnection(socket, passiveIo)
})


//* P R I V A T E
export const privateChatIo = io.of('/private')
privateChatIo.use(middleWare)
privateChatIo.on('connection', async (socket)=>{
	onPrivateConnection(socket, privateChatIo, io)
})	


//* R A N D O M
const randomChatIo = io.of('/random')
randomChatIo.use(middleWare) // * socket.user here It is used for the inviter room event, I need to cache user IDs. in the rooms cache.
randomChatIo.on('connection', (socket)=>{
	onRandomConnection(socket, randomChatIo)
})


//* G L O B A L
const globalChatIo = io.of('/global')
globalChatIo.use(middleWare) //* socket.user here is used to save the message 
globalChatIo.on('connection', (socket)=>{
	onGlobalConnection(socket, globalChatIo)
})


// const seedPrisma = async()=>{

	

// 	return
// }

await prisma.user.upsert({
	create: {
		email: 'CONSTRUCTOR',
		hash:  crypto.randomUUID(),
		id: 'CONSTRUCTOR',
		username: 'CONSTRUCTOR',
	},
	update: {},
	where:  {id: 'CONSTRUCTOR'},
})

await prisma.room.upsert({
	create: {
		isPrivate: false,
		roomName: 'GLOBAL',
		id: 'GLOBAL',
		createdById: 'CONSTRUCTOR',
	},
	update: {},
	where: {id: 'GLOBAL'},
})