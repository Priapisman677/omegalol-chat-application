import { MdOutlineMale } from "react-icons/md";
import CountyIcon from "./CountryIcon";
import { IoMdFemale } from "react-icons/io";
import { FaGenderless } from "react-icons/fa6";

type TextMessageProps = {
	message: ClientPrivateTextMessage;
	own: boolean;
	showMeta: boolean;
    displayedUsername: string
};
//prettier-ignore
type Gender = "male" | "female" | "unknown"

const icons: Record<Gender, React.JSX.Element> = {
male:    <MdOutlineMale    size={27} className="text-blue-400" title="male"/>,
female:  <IoMdFemale       size={25} className="text-pink-500" title="female" />,
unknown: <FaGenderless    size={20} className="cursor-pointer"  title="unknown gender"/>,
}


export function TextMessage ({message, own, showMeta, displayedUsername}: TextMessageProps) { 



    

    return (
        <div className={`flex flex-col ${own ? 'text-end justify-end': 'text-start'}`}>
            {showMeta && <div className={`flex  items-center gap-1 ${own ? 'justify-end': 'justify-start'} `}>
                <p className="text-[#c2c2c2] text-[14px] font-bold">{displayedUsername}</p>
                {message.gender && icons[message.gender]}
                <CountyIcon countryCode={message.countryCode || null} className='h-5 w-7'></CountyIcon>
                <p className="text-[#706e6e] text-xs">{new Date(message.timeStamp).toLocaleString()}</p>
            </div>}
            <p className={`${!showMeta && (own ? 'mr-9' : 'ml-9')}`} data-testid="message-text">{message.textContent}</p>
            
        </div>
    )
}
