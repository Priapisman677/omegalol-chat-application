import axios from "axios";
import { internalBaseURL } from "../network";

export const fetcher = async <T>(url: string) => {
  const res = await axios.get<T>(url, {
    withCredentials: true
  });
  return res.data;
};



export const getUserRoomsUrl = new URL('/api/getuserrooms', internalBaseURL)

export const getRoomMetaUrl = new URL('/api/getroommeta/', internalBaseURL)
