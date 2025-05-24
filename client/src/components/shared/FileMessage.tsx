import { internalBaseURL } from "@/lib/network";
import { MdOutlineMale } from "react-icons/md"
import { FaGenderless } from "react-icons/fa6"
import { IoMdFemale } from "react-icons/io"
import CountyIcon from "./CountryIcon";
type TextMessageProps = {
	message: ClientPrivateFileMessageWhenReceived;
	own: boolean;
	showMeta: boolean;
    displayedUsername: string
};
type Gender = "male" | "female" | "unknown"

const icons: Record<Gender, React.JSX.Element> = {
male:    <MdOutlineMale    size={27} className="text-blue-400" />,
female:  <IoMdFemale       size={25} className="text-pink-500" />,
unknown: <FaGenderless    size={20} className="cursor-pointer" />,
}


//prettier-ignore
export function  FileMessage ({message, own, showMeta, displayedUsername}: TextMessageProps) {

    const src = message.bytes
        ? URL.createObjectURL(new Blob([message.bytes], { type: 'application/octet-stream' }))
        : new URL(`/api/getmessageimage?filename=${message.fileName}`, internalBaseURL).href;

    return (
        <div className={`flex flex-col ${own ? 'text-end justify-end': 'text-start'}`}>
            {showMeta && <div className={`flex  items-center gap-1 ${own ? 'justify-end': 'justify-start'} `}>
                <p className="text-[#ffffff] text-[14px] font-bold">{displayedUsername}</p>
                <p className="text-[#706e6e] text-xs">{new Date(message.timeStamp).toLocaleString()}</p>
                {message.gender && icons[message.gender]}
                <CountyIcon countryCode={message.countryCode || null} className='h-5 w-7'></CountyIcon>
            </div>}
            <div className="flex justify-center items-center mt-2 mb-4">

				<img src={src}  alt="file"
					className="rounded-md object-contain max-w-[80%] max-h-[60vh] border border-[#353538]"/>

			</div>
            
        </div>
    )
}
