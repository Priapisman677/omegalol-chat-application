
//* INTERNAL (NEXT JS BACKEND)
const internalURL = process.env.NEXT_PUBLIC_INTERNAL_URL
const internalPort = process.env.NEXT_PUBLIC_INTERNAL_PORT

console.log({internalURL, internalPort});


export const internalBaseURL = new URL(internalURL as string)
internalBaseURL.port = internalPort as string

//* EXPRESS BACKEND
const serverURL = process.env.NEXT_PUBLIC_EXPRESS_URL
const serverPort = process.env.NEXT_PUBLIC_EXPRESS_PORT

export const serverBaseURL = new URL(serverURL as string)   
serverBaseURL.port = serverPort as string

