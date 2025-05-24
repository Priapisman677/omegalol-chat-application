
import Navbar from '@/components/shared/Navbar/Navbar';
import SideBarOuter from '@/components/authenticated/side_bar/SideBarParent';

import { SocketProvider } from '@/context/generic-socket-context';
import SideBarContextProvider from '@/context/SideBarSWRcontext';
import { getPublicRooms } from '@/actions/room-actions/get-public-rooms';


export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

	const {rooms} = await getPublicRooms()

	return (
		<SocketProvider nameSpace='private' withCredentials={true} autoConnect={false}>
			<SideBarContextProvider publicRooms={rooms}>
				<div className="flex h-full  bg-[#19191d]">
					<SideBarOuter></SideBarOuter>
					<div className="flex flex-col w-full h-full">
						<Navbar></Navbar>
						{children}
					</div>
				</div>
			</SideBarContextProvider>
		</SocketProvider>
	);
}
