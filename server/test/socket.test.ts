
import { clientSocketA, roomId, userId1 } from './setup.js';
import { prisma } from '../src/lib/db.js';
import {  test, expect } from 'vitest';
import {  validCookie2 } from './user-tokens.js';
import { client } from 'src/lib/redis-clients.js';
import { activeSocketPrivateTab, userRoomsKey } from '@shared/keys/user-keys.js';
import { connectedUsersInRoomKey } from '@shared/keys/rooms-keys.js';
import { io as Client, } from 'socket.io-client';


//! ENV loaded in vitest.config.ts


test('Should not save message if you are not in room', async () => {
	const result = await new Promise((res)=>{
		clientSocketA.on('error-event', res)
		clientSocketA.emit('send-message', {
			messageType: 'text',
			roomId,
			username: 'test',
			textContent: 'Hello',
		} as ClientPrivateTextMessage);
	})

	expect(result).toBe('You are not allowed to send messages in this room')

	const savedMessage = await prisma.message.findFirst({
		where: {
			textContent: 'Hello',
			roomId,
		},
	});

	expect(savedMessage).toBeFalsy();
});

test('should respond to a join room event', async () => {
	

	const serverPayload = await new Promise<string>((res) => {
		clientSocketA.emit('join-room', roomId, (serverPayload: string) => {
			res(serverPayload);
		});
	})
	
	expect(serverPayload).toEqual('Successfully joined room: backroom');

	//! The test "Sending a message saves it to db IF JOINED TO ROOM" depends on this test
})

test('Sending a message saves it to db IF JOINED TO ROOM', async () => {

	//! This test depends on the test "should respond to a join room event"

	clientSocketA.emit('send-message', {
		messageType: 'text',
		roomId,
		username: 'test',
		textContent: 'Hello',
	} as ClientPrivateTextMessage);

	await new Promise((r) => setTimeout(r, 200)); //! Wait for the message to be saved, if not, the test will fail. Could also work with callbacks but I'm giving it simple.

	const savedMessage = await prisma.message.findFirst({
		where: {
			textContent: 'Hello',
			roomId,
		},
	});

	expect(savedMessage).toBeTruthy();
});


test('should respond to a message event', async () => {
	const clientSocketB = Client('http://localhost:5000/private', {
		extraHeaders: {
			Cookie: validCookie2,
		},
	});
	await new Promise<void>((res, rej) => {
		clientSocketB.on('connect', ()=>{res(); console.log('CONNECTED WITH ID', clientSocketB.id)}).on('connect_error', rej);
	});

	
	await new Promise((r) => setTimeout(r, 200)); //! Without this, 70% of the time the test will fail because the server MIGHT HAVE NOT set up the join-room listener yet (because on 'connection' now has Redis async functions) and it's being called right away.

	await new Promise<void>((res)=>{
		clientSocketB.emit('join-room', roomId, (serverPayload: string) => {res(); console.log(serverPayload);}); //-  If you don't pass this call back the server will crash. You could also add a check in the server in case there is no call back passed, and not pass this column back but I'll just keep it like this for simplicity.
	})

	const message = await new Promise<object>((res) => {
		
		clientSocketB.on('receive-message', res);
		clientSocketA.emit('send-message', {
			messageType: 'text',
			textContent: 'TEST JEST',
			roomId,
			username: 'test',
		} as ClientPrivateTextMessage);
	});

	expect(message).toEqual({
		messageType: 'text',
		textContent: 'TEST JEST',
		roomId,
		username: 'test',
	} as ClientPrivateTextMessage);
});

test('should respond to a leave room event', async () => {
	//! This test needs to be placed after the test for receiving messages between the two sockets.
	const serverPayload = await new Promise<string>((res) => {
		clientSocketA.emit('leave-room', roomId, (serverPayload: string) => {
			res(serverPayload);
		});
	})

	expect(serverPayload).toEqual('Successfully left room: backroom');
})



test('should set activeSocketPrivateTab for a user on connection', async ()=>{
	const user1redisKey = await client.get(activeSocketPrivateTab(userId1))

	expect(user1redisKey).toBe(clientSocketA.id)

})

test('Should set user member in room Redis key when user joins a room', async ()=>{

	clientSocketA.emit('join-room', roomId, ()=>{})

	await new Promise((r) => setTimeout(r, 1000));

	const key = await client.sIsMember(connectedUsersInRoomKey(roomId), userId1)

	expect(key).toBe(true)
})

test('Should set room member in user key when user joins a room', async ()=>{	

	clientSocketA.emit('join-room', roomId, ()=>{})

	await new Promise((r) => setTimeout(r, 200));

	const key = await client.sIsMember(userRoomsKey(userId1), roomId)

	expect(key).toBe(true)
})



test('Should delete user member in room key when user leaves a room', async ()=>{

	clientSocketA.emit('join-room', roomId, ()=>{})

	await new Promise((r) => setTimeout(r, 200));

	const key = await client.sIsMember(connectedUsersInRoomKey(roomId), userId1)
	expect(key).toBe(true)

	clientSocketA.emit('leave-room', roomId , ()=>{})

	await new Promise((r) => setTimeout(r, 200));

	const key2 = await client.sIsMember(connectedUsersInRoomKey(roomId), userId1)

	expect(key2).toBe(false)
})

test('Should delete room member in user key when user leaves a room', async ()=>{

	clientSocketA.emit('join-room', roomId, ()=>{})

	await new Promise((r) => setTimeout(r, 200));

	const key = await client.sIsMember(userRoomsKey(userId1), roomId)
	expect(key).toBe(true)

	clientSocketA.emit('leave-room', roomId , ()=>{})

	await new Promise((r) => setTimeout(r, 200));

	const key2 = await client.sIsMember(userRoomsKey(userId1), roomId)

	expect(key2).toBe(false)
})