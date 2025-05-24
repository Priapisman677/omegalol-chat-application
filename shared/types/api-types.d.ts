type ServerResponse = {
	success: boolean;
	msg: string;
};



interface ServerGetUserRooms extends ServerResponse {
	rooms: userRoom[] 
}

type userRoom = {
	role: 'admin | member';
	roomName: string;
	id: string;
	isPrivate: boolean;
	roomPicPath: string;
	unReadMessages: number;
	createdBy: {
		id: string;
		username: string;
	};
	roomUserCount: null //* This will just be for a type of compatibility in <UserRooms> tsx
}; 
