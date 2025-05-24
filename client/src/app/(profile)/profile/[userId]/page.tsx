import { getUserInfo } from "@/actions/user-actions/get-user-info"
import { FaGenderless } from "react-icons/fa6"
import { IoMdFemale } from "react-icons/io"
import { MdOutlineMale } from "react-icons/md"
import { formattedCountries } from '@/lib/countries';
import { client } from "@/lib/redis-clients";
import { globalActiveUsersKey } from "@shared/keys/user-keys";
import OnlineStatus from "@/components/authenticated/_profile/OnlineStatus";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { internalBaseURL } from "@/lib/network";
import { InviteToRoomButton } from "@/components/authenticated/_profile/InviteToRoomButton";


type Props = {
    params: Promise<{ userId: string }>
}

export default async  function  AnotherUserProfile({params}: Props) {
    
    const headerStore = await headers() //? pass this to getuser if works
    const currentUserId = headerStore.get('userId') || undefined
    
    
    const { userId } = await params
    if(currentUserId === '#' + userId){
        redirect('/profile')
    }
    const user = await getUserInfo("#" + userId)

    //* These rooms are for the invitation model they do not refer to their rooms of the user you're visiting but your own rooms.



    if (!user) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold text-white">User Not Found :(</h1>
                    <p className="text-sm text-gray-500">We couldn’t find the profile you’re looking for.</p>
                </div>
            </div>
        );
    }


    

    type Gender = "male" | "female" | "unknown"

    // const isOnline = await client.zScore(globalActiveUsersKey, "#" + userId) === 1 ? true : false //! The fact that it needs to be one it is just an idea if I ever want to expand to different online status.

    const isOnline = await client.exists(globalActiveUsersKey("#" + userId)) === 1 //$ "exists" returns 1 if it exists and 0 if it does not. Manually converted to boolean.

    const icons: Record<Gender, React.JSX.Element> = {
        male:    <MdOutlineMale    size={32} className="text-blue-400 " />,
        female:  <IoMdFemale       size={30} className="text-pink-500 " />,
        unknown: <FaGenderless    size={25} className="" />,
    }

    const imageSrc = user?.profilePicPath 
  	? new URL(`/api/getprofileroomimage?imagename=${user.profilePicPath.split('/').pop()}&type=profile-pics`, internalBaseURL).href
 	: '/default-profile-pic.png';
    

    return (
        <div className="p-10 h-full bg-[#131313]">
            <div className="border border-[#353538] h-full rounded-xl bg-[#101011] p-6 flex flex-col gap-10">
                <div className="flex items-center">
                    {/* //*Picture*/}

                    <div className="h-[150px] w-[150px] flex items-center">
                        <div className="w-[90%] h-[90%] rounded-full  overflow-hidden">
                            <img src={imageSrc} className="object-cover w-full h-full"/>
                        </div>
                    </div>

                    {/* //*Name, id and status*/}
                    <div>
                        <h1 className="text-4xl max-w-150">{user?.username}</h1>
                        <h1 className="text-[#575757]">{user?.id}</h1>
                        <div className="flex self-end h-10 mr-[150px]">
                            <OnlineStatus online={isOnline} userId={userId}></OnlineStatus>
                        </div>
                    </div>


                </div>

                <div className="flex flex-col items-start gap-4 ml-8">
                    {/* //* Gender */}
                    <div className="flex items-center gap-2">
                        <p> Gender: </p>
                        <p className="font-bold">
                            {user?.gender ? (user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1)) : 'Unknown'}
                        </p>
                        {icons[user?.gender || 'unknown'] }
                    </div>
                    {/* //* Country */}
                    <div className="relative flex items-center mt-1 text-white">
                        <div className="flex items-center gap-2 text-center">
                            <img  src={
                                user?.countryCode? `https://flagcdn.com/w40/${user?.countryCode.toLowerCase()}.png` :'/Unknown_Flag.jpg'
                                }
                                alt="flag" className='h-5 w-7'
                                title={formattedCountries.find((c) => c.code === user?.countryCode)?.name ?? "Unknown Country"}/>
                            <span className='text-sm'>
                                {formattedCountries.find( (c) => c.code === user?.countryCode)?.name ?? "Unknown Country"}
                            </span>
                        </div>
                    </div>
                    {/* //* Bio */}
                    <div className="w-full max-w-xl mt-6 ml-8">
                        <label className="block mb-1 text-sm text-[#888]">Bio</label>
                        <div className="bg-[#1a1a1a] p-2 rounded border border-[#353538] text-sm text-[#ccc] min-h-[72px]">
                            {user?.bio?.trim() ? user.bio : <span className="text-[#555]">No bio provided.</span>}
                        </div>
                    </div>

                    {/* //* Invite to private room button */}
                    <InviteToRoomButton userId={userId}></InviteToRoomButton>   
                </div>
                
            </div>
        </div>
        
    )
}