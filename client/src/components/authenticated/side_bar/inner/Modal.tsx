'use client';

import { createRoom } from "@/actions/room-actions/create-room";
import { Info } from "@/components/shared/Info";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Switch from "react-switch"
import type { KeyedMutator } from 'swr'; // assuming this is where it's from

type ModalProps = {
	modalOpen: boolean;
	setModalOpen: (open: boolean) => void;
	mutate: KeyedMutator<ServerGetUserRooms>;
};

export function Modal({modalOpen, setModalOpen, mutate}: ModalProps) {
    const [isPrivate, setIsPrivate] = useState(false)
    const [roomName, setRoomName] = useState('')
	const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()
	//*Auto-focus modal input:
	useEffect(() => {
		if (modalOpen && inputRef.current) {
			inputRef.current.focus()
		}
	  }, [modalOpen]);
	  

	const handleRoomCreate = async ()=>{
		if (!roomName.trim()) {			
			setError('Room name is required')
			return
		}
		const data: CreateRoomActionResponse = await createRoom({roomName, isPrivate})
		
		if(!data.success){
			toast.error(data.msg)
			return
		}
		setModalOpen(false)
		mutate()
		router.push('/chat/' + data.room?.id)
		toast.success('Room created')
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onClick={() => setModalOpen(false)}
		>
			<div
				className="bg-[#101011] border border-[#212121] text-white p-6  rounded shadow-lg w-[300px]"
				onClick={(e) => {
					e.stopPropagation();
				}} //$f It stops the event from bubbling up to parent elements.
				//$ This PREVENTS the modal from closing when you click inside.
			>
				<p className="mb-4 font-semibold text-center">
					{' '}
					Create new room
				</p>
				<input
					className="border border-[#373737] w-full h-8 rounded-[7px] p-2"
					placeholder="Room name"
					value={roomName}
					onChange={(e) => setRoomName(e.target.value)}
					ref={inputRef}
					onKeyDown={(e)=>{
						if(e.key === "Enter"){
							handleRoomCreate()
						}
					}}
					
				></input>
				<div className="flex items-center justify-between w-full gap-2 mt-4">
					<div className="flex items-center gap-1">
						<span className="text-sm">Private Room</span>
						<div className="relative group">
							<Info text="If private, only you can add users."/>
							<div className="absolute left-full top-1/2 -translate-y-1/2 mt-1 w-max pointer-events-none px-2 py-1 text-xs text-white bg-[#101011] border border-[#212121] rounded opacity-0 group-hover:opacity-100  z-10 whitespace-nowrap">
								<p>If private, only you can add users.</p>
							</div>
						</div>
					</div>
					<Switch
						onChange={setIsPrivate}
						checked={isPrivate}
						offColor="#888"
						onColor="#0b5bbd"
						uncheckedIcon={false}
						checkedIcon={false}
						height={20}
						width={40}
					/>
				</div>
				{error && <p className="mt-2 text-sm text-center text-red-500">{error}</p>}
				<button
					className="mt-1 w-full bg-[#0b5bbd] hover:cursor-pointer hover:bg-[#638aff] text-white rounded px-3 py-1"
					onClick={handleRoomCreate}
				>
					Create
				</button>
			</div>
		</div>
	);
}
