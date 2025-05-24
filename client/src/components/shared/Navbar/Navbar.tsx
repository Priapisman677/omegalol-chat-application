'use client';

import { useSession } from '@/context/session-context';
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { RiGlobalLine } from "react-icons/ri";
import Link from 'next/link';
// import { LuMessageCircleHeart } from "react-icons/lu";
import { NavAuth } from './NavAuth';
import { usePathname } from 'next/navigation';


export default function Navbar() {
    const {session,} = useSession()

	//prettier-ignore
	return (
		<div className="w-full h-[50px] bg-[#131313]  flex gap-10 items-center">
			<Link href={'/'} className='cursor-pointer'>
				<img src="/nav-omegalol.png" className="h-7 w-auto object-contain ml-2"></img>
			</Link>
			<div className="flex items-center justify-around w-[90%] h-full">
				<NavLink href={'/chat'} icon={<></>} label={'Private Rooms'}></NavLink>
				<NavLink href={'/random'} icon={<GiPerspectiveDiceSixFacesRandom size={25}/>} label={'Random'}></NavLink>	
				<NavLink href={'/global'} icon={<RiGlobalLine size={25}/>} label={'Global'}></NavLink>
			</div>
			{session ? 
				<NavAuth></NavAuth>
				:
				<div className="w-[20%] h-full flex items-center justify-center ">
					<div className="flex items-center gap-4">
						<Link href={'/login'} className="font-bold" target="_blank" rel="noopener noreferrer">
							<p className="text-sm hover:cursor-pointer underline "> Log in</p>
						</Link>
						<Link href={'/signup'} className="font-bold">
							<p className="text-sm hover:cursor-pointer underline "> Sign up</p>
						</Link>
					</div>
				</div>
			}
		</div>
	);
}



type NavLinkProps = {
	href: string;
	icon: React.ReactNode;
	label: string;
	activeClass?: string;
	defaultClass?: string;
	exact?: boolean;
};

function NavLink({ href, icon, label, activeClass = 'px-4 text-white bg-[#2916b8] font-bold underline', defaultClass = 'bg-[#131313] text-[#5e5e5e]', exact = false,}: NavLinkProps) {
	const pathname = usePathname();
	const isActive = exact ? pathname === href : pathname.startsWith(href);

	return (
		<Link href={href} className='flex-1 h-full' target="_blank" rel="noopener noreferrer">
			<div className={`h-full w-full flex items-center hover:bg-gray-900 justify-center gap-1 text-sm ${isActive ? activeClass : defaultClass}`}>
				{icon}
				<p>{label}</p>
			</div>
		</Link>
	);
}