'use client';

import {SearchBar} from "./SearchBar";
import { useRoomContext } from "@/context/RoomContext";
import UsersSection from "./UsersSection";
import ChangePictureShared from "@/components/authenticated/shared/ChangePicture";
import { uploadRoomPic } from "@/actions/room-actions/upload-room-pic";
import { internalBaseURL } from "@/lib/network";
import {LeaveRoom} from "./LeaveRoom";
import { useSideBarContext } from "@/context/SideBarSWRcontext";
export  function Modal({setModalOpen}: { setModalOpen: (open: boolean) => void;}) {
	const {roomMeta, mutateMeta: mutateMetaHeader} = useRoomContext()
	const {mutate: mutateDataSideBar} = useSideBarContext()
	
	if(!roomMeta) return <p>'Error at Modal'</p>

	const fileUploader = async (file: File)=>{
		const result = await uploadRoomPic({file, roomId: roomMeta.id})
		await mutateMetaHeader()
		await mutateDataSideBar()
		return result
	}

	const imageSrc = roomMeta?.roomPicPath 
    ? new URL(`/api/getprofileroomimage?imagename=${roomMeta.roomPicPath.split('/').pop()}&type=room-pics`, internalBaseURL).href
    : '/group.png';


	//prettier-ignore
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 justify  "
		 	onClick={() => setModalOpen(false)}>
			<div
				className="bg-[#101011] border border-[#212121] text-white p-6  rounded shadow-lg w-[600px] flex flex-col relative max-h-[90vh]"
				onClick={(e) => {
					e.stopPropagation();
				}}>

				<ChangePictureShared  fileUploader={fileUploader} defaultPicturePath={imageSrc || '/group.png'}/>
				<p className="mb-4 font-semibold text-center text-xl"> {roomMeta?.roomName ||'No name'}</p>
				<p className="mb-4 font-semibold text-center text-sm text-gray-500">{roomMeta?.isPrivate ? 'Private room' : 'Public room'}</p>
                    
                <SearchBar></SearchBar>
                {/* //* Users section */}
				<div className="flex flex-col justify-between w-full gap-2 mt-4"> 
					<div className="flex justify-between">
						<span className="mb-2 font-bold">Users</span>
					</div>
					<UsersSection></UsersSection>
				</div>
                <LeaveRoom></LeaveRoom>
			</div>
		</div>
	);
}



