import { SearchBar } from '@/components/authenticated/_chat/chat_header/modal/SearchBar';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import { addIdToRoom } from '@/actions/room-actions/add-id-to-room';
import { searchUsersRedis } from '@/actions/redis-actions/search-users';

const users = [
	{ id: 'user-1', username: 'alice' },
	{ id: 'user-2', username: 'bob' },
	{ id: 'user-3', username: 'charlie' },
];

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
					users,
				},
				mutateMeta: jest.fn(),
			};
		},
	};
});

jest.mock('@/actions/redis-actions/search-users', () => {
	return {
		__esModule: true,
		searchUsersRedis: jest.fn(),
		//! keywords for your later debug: domock, hoist, mock = jest.fn, hoisted, action
	};
});

jest.mock('@/actions/room-actions/add-id-to-room', () => {
	return {
		__esModule: true,
		addIdToRoom: jest.fn(),
	};
});
beforeEach(() => {
	jest.clearAllMocks();
});

test('render', async () => {
	const { container } = render(<SearchBar></SearchBar>);

	expect(container.querySelector('div.relative.flex')).toBeInTheDocument();

	const input = screen.getByRole('textbox');

	expect(input).toBeInTheDocument();
});

test('call search action only 1 time after typing many letters', async () => {
	(searchUsersRedis as jest.Mock).mockReturnValue({
		success: true,
	});

	render(<SearchBar></SearchBar>);

	const input = screen.getByRole('textbox');

	await user.type(input, 'alice');

	await act(async () => {
		//$ Last resort ;)
		await new Promise((r) => setTimeout(r, 500));
	});

	expect(searchUsersRedis).toHaveBeenCalledTimes(1);
});

test('call search action only 2 times after typing many letters, pausing and typing again', async () => {
	(searchUsersRedis as jest.Mock).mockReturnValue({
		success: true,
	});

	render(<SearchBar></SearchBar>);

	const input = screen.getByRole('textbox');

	await user.type(input, 'alice');

	await act(async () => {
		//$ Last resort ;)
		await new Promise((r) => setTimeout(r, 500));
	});

	await user.type(input, 'bob');

	await act(async () => {
		//$ Last resort ;)
		await new Promise((r) => setTimeout(r, 500));
	});

	expect(searchUsersRedis).toHaveBeenCalledTimes(2);
});

test('Testing this should display users in the search results after successful search.', async () => {
	(searchUsersRedis as jest.Mock).mockReturnValue({
		success: true,
		foundUsers: [
			{ userId: 'user-1', data: { username: 'alice' } },
			{ userId: 'user-2', data: { username: 'bob' } },
			{ userId: 'user-3', data: { username: 'charlie' } },
		] as RedisJsonUserResult[],
	});

	render(<SearchBar></SearchBar>);

	const input = screen.getByRole('textbox');

	await user.type(input, 'alice');

	await act(async () => {
		//$ Last resort ;)
		await new Promise((r) => setTimeout(r, 500));
	});

	const alice = screen.getByText('alice');
	expect(alice).toBeInTheDocument();

	const bob = screen.getByText('bob');
	expect(bob).toBeInTheDocument();

	const charlie = screen.getByText('charlie');
	expect(charlie).toBeInTheDocument();
});

test('I should call "addIdToRoom" action when clicking on a user', async () => {
	(addIdToRoom as jest.Mock).mockReturnValue({
		success: true,
	});

	(searchUsersRedis as jest.Mock).mockReturnValue({
		success: true,
		foundUsers: [
			{ userId: 'user-1', data: { username: 'alice' } },
		] as RedisJsonUserResult[],
	});

	render(<SearchBar></SearchBar>);

	const input = screen.getByRole('textbox');

	await user.type(input, 'alice');

	await act(async () => {
		//$ Last resort ;)
		await new Promise((r) => setTimeout(r, 500));
	});

	const username = screen.getByText('alice');

	const addedUserId = screen.getByText('user-1');
	expect(addedUserId).toBeInTheDocument();
	await user.click(username);

	expect(addIdToRoom).toHaveBeenCalledWith('user-1', 'room-123');
});
