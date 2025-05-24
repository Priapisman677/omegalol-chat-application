//% Here belong all keys that you need to pass a room ID


export const connectedUsersInRoomKey = (roomId: string)=> 'roomsLive:' + roomId //* Set

export const cacheUsersInRoomKey = (roomId: string) => 'roomCache:'+ roomId //* HASH

export const usersInRandomRoom = (roomId: string) => 'randomRoom:'+ roomId //* HASH
