import '@testing-library/jest-dom'; //*  Need to  import manually because this holds some custom matchers such as "toBeInTheDocument()"
import ChatMessages from '@/components/shared/ChatMessages';
import { screen, render} from '@testing-library/react';
import { TextMessage } from '@/components/shared/TextMessage';

jest.mock('@/context/session-context', () => {
    return {
        __esModule: true,
        useSession: () => ({
            session: {
                id: '123',
                username: 'John',
                email: 'johndoe@me.com',
                profilePicPath: null,
                countryCode: 'CA',
                bio: 'I like Redis',
                gender: 'female'

            } as UserSession,
        }),
    }
})

test('Should render 1 message box per message', () => {
	const messages: ClientPrivateTextMessage[] = [
		{
			textContent: 'Hello',
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

	render(<ChatMessages messages={messages} chatIdentifier='123'></ChatMessages>);

	const messagesContainer = screen.getByRole('region', {
		name: 'chat-messages',
	});

    const messageBoxes = screen.getAllByRole('region', {
        name: 'message'
    });

    expect(messagesContainer).toBeInTheDocument();
    expect(messageBoxes).toHaveLength(messages.length)

});

test('renders nothing when messages is null', () => {
	render(<ChatMessages messages={[]} chatIdentifier='123'></ChatMessages>);

    const chatMessagesDiv = screen.queryByRole('region', {
		name: 'chat-messages',
	});

    const messageBoxes = screen.queryAllByRole('region', {
        name: 'message'
    });

    
	expect(chatMessagesDiv).toBeInTheDocument();
    expect(messageBoxes).toHaveLength(0);
});


test('renders nothing when messages length is 0', () => {
	render(<ChatMessages messages={[]} chatIdentifier='123'></ChatMessages>);

    const messageBoxes = screen.queryAllByRole('region', {
        name: 'message'
    });
    expect(messageBoxes).toHaveLength(0);

});


describe('TextMessage', () => {
  test('renders as own message when session.userId matches message.userId', () => {
    const message: ClientPrivateTextMessage = {
      textContent: 'Hello',
      username: 'John',
      messageType: 'text',
      roomId: '123',
      userId: '123',
      profilePicPath: null,
      timeStamp: new Date(),
    };


    const {container}  = render(<TextMessage message={message} own={true} showMeta={true} />);

    const messageBox = container.querySelector('div.flex.flex-col');
    expect(messageBox).toHaveClass('flex flex-col text-end justify-end')

    const text = screen.getByTestId('message-text');
    expect(text).toHaveTextContent(message.textContent);
  });

  test('renders as other user message when session.userId does not match message.userId', () => {
    const message: ClientPrivateTextMessage = {
      textContent: 'Goodbye',
      username: 'Alice',
      messageType: 'text',
      roomId: '456',
      userId: '456',
      profilePicPath: null,
      timeStamp: new Date(),
    };


    const {container} = render(<TextMessage message={message} own={false} showMeta={true} />);

    const messageBox = container.querySelector('div.flex.flex-col');
    expect(messageBox).toHaveClass('flex flex-col text-start')

    const text = screen.getByTestId('message-text');
    expect(text).toHaveTextContent(message.textContent);
  });
});