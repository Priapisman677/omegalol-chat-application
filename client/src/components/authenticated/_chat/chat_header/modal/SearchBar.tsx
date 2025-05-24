'use client';

import { searchUsersRedis } from '@/actions/redis-actions/search-users';
import { addIdToRoom } from '@/actions/room-actions/add-id-to-room';
import { CirclePictureSmall } from '@/components/authenticated/shared/CirclePictureSmall';
import { useRoomContext } from '@/context/RoomContext';
import { internalBaseURL } from '@/lib/network';
import React, { useEffect, useRef, useState } from 'react';

//prettier-ignore
export function SearchBar({}: {}) {
	const [open, setOpen] = useState(false);
	const [searchInput, setSearchInput] = useState<string>('');
	const [results, setResults] = useState<RedisJsonUserResult[]>([]);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null); //* Now refer to the input.
	
	const {roomMeta, mutateMeta} = useRoomContext()
	if(!roomMeta) return <p>'Error at SearchBar'</p>

	const timeoutRef = useRef<NodeJS.Timeout | null>(null); // ✅ This survives renders
	//$ useRef creates an object that does not reset between renders.
	//$ ✅ timeoutRef.current lives across renders.
	//$ ✅ It doesn't reset when component re-renders.
	//$ ✅ It holds the REAL timeout across multiple handleInput calls.

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				inputRef.current &&
				!inputRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchInput(value);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		//$ timeoutRef.current = setTimeout(...) schedules a new call.
		timeoutRef.current = setTimeout(async () => {
			const result: UserSearchActionResponse = await searchUsersRedis(value);
			if (!result.success) {
				setError(result.msg);
				return;
			}
			setError(null);
			setResults(result.foundUsers || []);
		}, 300); //* Wait 300ms after the last keystroke
	};
	const addToRoom = async (userId: string) => {
		const newUser = await addIdToRoom(userId, roomMeta.id);
		if (!newUser.success) {

			if (newUser.msg) {
				setError(newUser.msg);
				return;
			}

			setError('Failed to add user to room');
			return;
		}
		await mutateMeta()
		return;
	};

	function SearchResults() {
		return (
			<>
				{open && results.length > 0 && (
					<div className="absolute top-full left-0 w-full bg-[#1c1c1c] p-4 z-10 flex flex-col">
						{results.map((result, idx) => {
							
							const imageSrc = result?.data?.profilePicPath
								? new URL(`/api/getprofileroomimage?imagename=${result.data.profilePicPath.split('/').pop()}&type=profile-pics`, internalBaseURL).href
								: '/default-profile-pic.png';
							return (
								<button
									className="relative text-left hover:bg-[#2b2b2b] hover:cursor-pointer py-2"
									key={result.userId}
									
									onMouseDown={() => {
										//!  It is important that you make this on mouse down instead of on click if you said it so that when you click on the button it disappears.
										console.log('adding to room...');
										addToRoom(result.userId);
									}}
								>
									<div className='flex justify-between items-center'>
										<CirclePictureSmall src={imageSrc} proportions={8}></CirclePictureSmall>
										<p className='truncate w-[60%]'>{result.data.username}</p>
										<p className='text-[#6e6e6e] text-sm'>{result.userId}</p>
									</div>

									{idx < results.length - 1 && (
										<div className="my-2 border-t border-gray-600 opacity-40" />
									)}
								</button>
						)})}
					</div>
				)}
			</>
		);
	}

	return (
		<div className="relative flex justify-center py-1 flex-4">
			<div className="w-[80%] relative">
				<div className="w-full h-full flex items-center border border-[#454545] px-2 rounded-sm bg-[#2a2a2a]">
					<input
						ref={inputRef} // Attach ref to the input
						className="w-full h-8 text-white bg-transparent outline-none"
						type="text"
						name="input"
						placeholder="Add user by name or #ID"
						onFocus={() => setOpen(true)} // Open the rectangle when you focus the input
						autoComplete="off"
						value={searchInput}
						onChange={handleInput}
					/>
				</div>
				<p className="text-red-500"> {error && error} </p>
				<SearchResults />
			</div>
		</div>
	);
}
