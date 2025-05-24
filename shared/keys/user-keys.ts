//% Here belong all keys that you need to pass a user ID (or IP lol)


export const userJSONkey = (userId: string) => 'userJSON:' + userId //* JSON

export const rateLimitKey = (userId: string, actionKey: string)=>  `rate_limit:${userId}:${actionKey}`; //* Sorted set

export const userRoomsKey =  (userId: string)=> 'userRoom:' + userId //* Set


export const activeSocketPrivateTab = (userId: string)=> 'activeSocket:' +  userId //* String-Key

export const globalActiveUsersKey = (userId: string)=> 'globalActiveUsers:' + userId  //* Set

export const globalActiveIPsKey = (ip: string) => "globalActiveIps:" + ip //* Set