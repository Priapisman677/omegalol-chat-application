
import { Socket } from 'socket.io';


declare module 'socket.io' {
  interface Socket {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
    data: {
      matchRoom: string | undefined
    }
  }
}

