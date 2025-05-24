type MessageType = 'text' | 'file' | 'event'; // mirrors Prisma enum

type PrivateBaseMessage = {
  username: string?;
  messageType: MessageType;
  roomId: string;
  timeStamp: Date;
  profilePicPath : string?;
  userId: string?; //$ In Randoms chats this will be  the socketId, To know if the message belongs yo you from const own = chatIdentifier === message.userId
  identifier: string;
  countryCode: string?;
	gender: ('male'|'female'|'unknown')?;
};

interface ClientPrivateTextMessage extends PrivateBaseMessage {
  messageType: 'text';
  textContent: string;
}


interface ClientPrivateFileMessageBeforeSend extends PrivateBaseMessage{
  //- May 3: Already thought about how to handle files over sockets. These types will both be sent from sockets and received from sockets. metadata is important to be received over sockets as well. Once a client uploads a file via zod validation over an input of type file, a file url will be generated pointing to the file saved in the server, while the second socket will receive the metadata in order to load that file.
  messageType: 'file';
  bytes: Uint8Array?
}

interface ClientPrivateFileMessageWhenReceived extends ClientPrivateFileMessageBeforeSend {
  fileUrl: string?;
  fileSize?: number;
  mimeType?: string;
  fileName: string;
  bytes: Uint8Array?;
  fileType?: string
}


interface EventMessage extends PrivateBaseMessage {
  messageType: 'event';
  textContent: string;
  userId: 'event-user';

} 

type ClientPrivateMessage = ClientPrivateTextMessage | ClientPrivateFileMessageWhenReceived | EventMessage;



//* Other

type InviteToRoomMessage ={
  roomId: string;
  strangerInviteInfo: StrangerInfoPayload;
}

type StrangerInfoPayload ={
  //* Why null?
  //* Case 1:
  //* If the invitation is being sent from the user profile they will not need the socket ID.
  //* Case 2:
  //* If the invitation is being sent from the random chat, the user I D might not be defined which is handled properly.
  userId: string | null;
  socketId: string | null;
}