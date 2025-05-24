import ChatWindow from '@/components/authenticated/_chat/ChatWindow';
import { render, screen } from '@testing-library/react';
import { useSocket } from '@/context/generic-socket-context';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';


jest.mock('next/navigation', ()=>{
	return {
		__esModule: true,
		useRouter: jest.fn()
	}
})

jest.mock('@/context/session-context', () => {
	return {
		__esModule: true,
		useSession: () => ({
			session: {
				id: '123',
				username: 'John',
				email: 'johndoe@me.com',
			},
		}),
	};
});

jest.mock('@/context/RoomContext', () => {
	return {
		__esModule: true,
		useRoomContext: () => {
			return {
				roomMeta: {
					id: 'room-123',
					roomName: 'General Chat',
					isPrivate: false,
					createdBy: {
						id: 'user-1',
						username: 'alice',
					},
					users: [
						{ id: 'user-1', username: 'alice' },
						{ id: 'user-2', username: 'bob' },
						{ id: 'user-3', username: 'charlie' },
					]
				},
				mutateMeta: jest.fn(),
			};
		},
	};
});

jest.mock('@/actions/user-actions/save-file-message', ()=>{
	return {
		__esModule: true,
		saveFileMessage: jest.fn()
	}
})



jest.mock('@/components/authenticated/_chat/chat_header/ChatHeader', ()=>{
	return {
		__esModule: true,
		ChatHeader: ()=>{
			return <div> Header Mock </div>
		}
	}
})

const emitMock = jest.fn(); //* Declared outside only so that they can be asserted inside of tests.
let offMock = jest.fn();
let onMock = jest.fn((event, cb)=>{
	if(event === 'ready'){
		//$ On the useChatSocket hook it calls socket.on('ready', cb) for us. I just need to call it manually in the test to mock it.
		readyCallback = cb
	}
});

jest.mock('@/context/generic-socket-context', () => ({
	useSocket: jest.fn(),
}));

let readyCallback: Function; //* Will let me simulate the "ready" event.

(useSocket as jest.Mock).mockReturnValue({
	emit: emitMock,
	on: onMock,
	off: offMock,
	connect: jest.fn(),
	nsp : '/private'
});

beforeEach(()=>{
	
	jest.clearAllMocks() //! Necessary for assertions!!
})


test('Should render messages', () => {


	const messages: ClientPrivateMessage[] = [
		{
			textContent: 'hello',
			username: 'John',
			messageType: 'text',
			roomId: '123',
			userId: '123',
			profilePicPath: null,
   		    timeStamp: new Date(),
		},
		{
			textContent: 'Goodbye',
			username: 'Alice',
			messageType: 'text',
			roomId: '456',
			userId: '456',
			profilePicPath: null,
     		timeStamp: new Date(),
		},
	];

	render(
		<ChatWindow usersOnline={0} roomId="abc123" initialMessages={messages}></ChatWindow>
	);

	expect(screen.getByText('hello')).toBeInTheDocument();
});

it('sends message on Enter key', async () => {
	const { getByPlaceholderText } = render(
		<ChatWindow usersOnline={0} roomId="room1" initialMessages={[]} />
	);

	const input = getByPlaceholderText('Type your message');

    expect(input).toBeInTheDocument();

    await user.type(input, 'Hello{Enter}');
	expect(emitMock).toHaveBeenCalledWith(
		'send-message',
		expect.objectContaining({ textContent: 'Hello' })
	);
});

test('should emit a join-room event based on prop roomId', ()=>{
	render(<ChatWindow usersOnline={0} roomId='backroom' initialMessages={[]}></ChatWindow>)
	readyCallback()

	expect(emitMock).toHaveBeenCalledWith('join-room', 'backroom', expect.any(Function))
})

test('Should not emit a join room event if the room ID is "home"', ()=>{

	
	render(<ChatWindow usersOnline={0} roomId='home' initialMessages={[]}></ChatWindow>)

	readyCallback() //* Call this only after render() so it gets called	 with the correct the if statement check.

	expect(emitMock).not.toHaveBeenCalledWith('join-room', expect.any(String), expect.any(Function))

})


test('sets up socket event listeners', () => {
	render(<ChatWindow usersOnline={0} roomId="backroom" initialMessages={[]} />);

	expect(onMock).toHaveBeenCalledWith('ready', expect.any(Function));
	expect(onMock).toHaveBeenCalledWith('receive-message', expect.any(Function));
	expect(onMock).toHaveBeenCalledWith('error-event', expect.any(Function));
	expect(onMock).toHaveBeenCalledWith('connect_error', expect.any(Function));
	expect(onMock).toHaveBeenCalledWith('error', expect.any(Function));
	expect(onMock).toHaveBeenCalledWith('prevent-duplicate-connection', expect.any(Function));
	expect(onMock).toHaveBeenCalledWith('get-online-users', expect.any(Function));
});

test('cleans up socket event listeners on unmount', () => {
	const {unmount} = render(<ChatWindow usersOnline={0} roomId="backroom" initialMessages={[]} />);

	unmount();

	expect(offMock).toHaveBeenCalledWith('ready');
	expect(offMock).toHaveBeenCalledWith('receive-message');
	expect(offMock).toHaveBeenCalledWith('error-event');
	expect(offMock).toHaveBeenCalledWith('connect_error');
	expect(offMock).toHaveBeenCalledWith('error');
	expect(offMock).toHaveBeenCalledWith('join-room');
});