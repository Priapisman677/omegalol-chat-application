'use client';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import { useSession } from '@/context/session-context';
import { DeleteAccount } from '@/components/authenticated/_profile/DeleteAccount';
import { ModifyUsername } from '@/components/authenticated/_profile/ModifyUsername';
import { CountrySelect } from '@/components/authenticated/_profile/SelectCountry';
import ChangePicture from '@/components/authenticated/_profile/ChangePicture';
import { SelectGender } from '@/components/authenticated/_profile/SelectGender';
import { ModifyBio } from '@/components/authenticated/_profile/ChangeBio';
import { useState } from 'react';
import OnlineStatus from '@/components/authenticated/_profile/OnlineStatus';


//prettier-ignore
export default function Profile() {

    const {session} = useSession()
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (id: string) => {
        navigator.clipboard.writeText(id).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    return (
        <div className="p-10 h-full bg-[#131313] ">
            <div className="border border-[#353538] h-full rounded-xl bg-[#101011] relative p-6 flex flex-col gap-10">
                {/* //$ h-[150px] is more "forcing than h-50" use for rounded images */}
                <div className="flex items-center">
                    
                    <ChangePicture></ChangePicture>
                    <div>
                        {/* //* Username */}
                        <ModifyUsername></ModifyUsername>
                        
                        {/* //* User ID */}
                        <h1 className=" text-[#575757] flex items-center hover:cursor-pointer hover:underline" onClick={() => copyToClipboard(session?.id || '')}>
                            {session?.id}
                            <button className="flex ml-2 hover:cursor-pointer">
                                <HiOutlineClipboardDocument />
                                {copied && 'Copied!'}
                            </button>
                        </h1>
                        <div className="flex self-end h-10 mr-[150px]">
                            <OnlineStatus online={true} userId={session?.id!}></OnlineStatus>
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col items-start gap-4 ml-8'>
                    <SelectGender></SelectGender>
                    <CountrySelect></CountrySelect> 
                </div>
                <ModifyBio></ModifyBio>
                <DeleteAccount></DeleteAccount>
            </div>
        </div>
    )
}
