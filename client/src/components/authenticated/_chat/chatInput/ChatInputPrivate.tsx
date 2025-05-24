'use client';
import FileInput from '../../../shared/FileInput';
import { TextInputPrivate } from './TextInputPrivate';


//prettier-ignore
export default function ChatInputPrivate({ insertMessage}: {insertMessage: (message: ClientPrivateMessage) => void;}) {

	return (
		<div className=" h-16 flex items-center justify-around bg-[#272727]">
			<FileInput  insertMessage={insertMessage}></FileInput>

			<TextInputPrivate insertMessage={insertMessage} ></TextInputPrivate>
		</div>
	);
}
