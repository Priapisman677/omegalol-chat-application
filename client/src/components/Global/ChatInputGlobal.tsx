'use client';
import { TextInputRandomGlobal } from '../shared/TextInputRandomGlobal';
import FileInput from '../shared/FileInput';


//prettier-ignore

type Props = {
    insertMessage: (message: ClientPrivateMessage) => void;
    disabled: boolean
};

export function ChatInputGlobal({ insertMessage, disabled}: Props) {


    return (

                //? h-full is not causing the issue
        <div className=" h-full flex items-center  justify-around bg-[#272727] w-full">
            <FileInput  insertMessage={insertMessage} disabled={disabled}></FileInput>

            <TextInputRandomGlobal insertMessage={insertMessage}  disabled={disabled}></TextInputRandomGlobal>
        </div>
    );
}
