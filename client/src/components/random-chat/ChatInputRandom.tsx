'use client';
import { useRandomChatContext } from '@/context/RandomRoomContext';
import FileInput from '../shared/FileInput';
import { TextInputRandomGlobal } from '../shared/TextInputRandomGlobal';


//prettier-ignore

type Props = {
    insertMessage: (message: ClientPrivateMessage) => void;
};

export function ChatInputRandom({ insertMessage}: Props) {

    const {disabled} = useRandomChatContext(); //* File input is used in global too so "disabled" is optional.


    return (

                //? h-full is not causing the issue
        <div className=" h-full flex items-center  justify-around bg-[#272727] w-full">
            <FileInput  insertMessage={insertMessage} disabled={disabled}></FileInput>

            <TextInputRandomGlobal insertMessage={insertMessage}  ></TextInputRandomGlobal>
        </div>
    );
}
