"use client"

import '@/app/globals.css'


import { useSession } from "@/context/session-context";
import { TextMessage } from './TextMessage';
import { FileMessage } from './FileMessage';
import { CirclePictureSmall } from '../authenticated/shared/CirclePictureSmall';
import { internalBaseURL } from '@/lib/network';
import { EventMessage } from './EventMessage';
import { useAutoScroll } from '@/hooks/useAutoScroll';
//prettier-ignore

type Props = {
    messages: ClientPrivateMessage[] 
    chatIdentifier: string | undefined
}
//$ Could be null if the session exists, could be undefined if the session does not exist.
const getImageSrc = (path?: string | null) => 
    path ? new URL(`/unprotectedapi/getprofileimage?imagename=${path.split('/').pop()}`, internalBaseURL).href : '/default-profile-pic.png';

export default function  ChatMessages({messages, chatIdentifier}: Props) {

    const { session } = useSession() as { session: UserSession | null }; // This will just be used to get the picture in private chats
    const ownImageSrc =  getImageSrc(session?.profilePicPath);
    const scrollRef = useAutoScroll([messages.length]); //! I plain copied this LOL
    return (
        //$ "flex-1" means that the div will take all the available space from ITS PARENT
        //$ "overflow-y-auto" enables scrolling when there is too much content.
        <div role="region" aria-label="chat-messages" className="flex flex-col flex-1 h-full px-1 overflow-y-auto custom-scrollbar overflow-hidden" ref={scrollRef}>
            {messages ? messages.map((message, index)=>{
                if(!chatIdentifier){return <p> No socket Identifier</p>} //! This has to be placed here and not before because this depends on the random socket ID but if it is not ready when loading the page it will return early.   

                if (message.messageType === 'event') { return <EventMessage message={message} key={index}></EventMessage>}

                const own = chatIdentifier === message.identifier
                const prev = index > 0 ? messages[index - 1] : null;

                // 1. Are we switching users?
                const isNewUser = !prev || prev.identifier !== message.identifier
                // 2. Has more than one minute passed?
                //    (assumes message.timestamp is a Date or millisecond number)
                const elapsedMs = prev
                ? new Date(message.timeStamp).getTime() - new Date(prev.timeStamp).getTime()
                : Infinity
                const isNewMinute = elapsedMs > 60_000
            
                // show metadata if either condition is true
                const showMeta = isNewUser || isNewMinute || message.messageType === 'file'
                //*  PROFILE PICTURE
                const profileSrc = own ? ownImageSrc : getImageSrc(message.profilePicPath);
                const profileHref = own ? '/profile' : `/profile/${message.userId?.slice(1)}`;

                //* USERNAME
                let displayedUsername: string
                if(own){
                    displayedUsername = 'You'
                }else if ((message.userId !== "CONSTRUCTOR")){
                        //% If message doesn't come from database or it is loaded online.
                    displayedUsername = message?.username! || 'Stranger ' + message.identifier
                } else { //% If message id is constructor  AND COMES FROM DATABASE
                    displayedUsername = 'Stranger ' + message.identifier
                } 

                return (
                    //- "thin-border" is a custom class that I defined in globals.css
                    <div className={`${own ? 'text-end justify-end': 'text-start'} flex gap-1 hover:bg-[#6f69692a]  w-full  break-all 
                        ${showMeta ? 'thin-border-top' : ''} `}
                        role="region" aria-label="message"  key={index}>

                        {!own && showMeta && <CirclePictureSmall proportions={8} src={profileSrc}  href={profileHref }/>}
                        {
                            message.messageType === 'text' ? 
                            <TextMessage  message={message} own={own} showMeta={showMeta} displayedUsername={displayedUsername}></TextMessage>:
                            <FileMessage message={message} own={own} showMeta={showMeta} displayedUsername={displayedUsername}></FileMessage>
                        }
                        {own && showMeta && <CirclePictureSmall proportions={8}  src={ownImageSrc} href={profileHref }/>}
                    </div>
                )
            }): null}
        </div>
    )
}
