import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

export const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  SYNC_CODE: "sync_code",
  UPDATE: "update",
  DISCONNECTED: "disconnected",
  GETUSERS: "getUsers",
  LEAVEROOM: "leaveRoom",
  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
  MUTE: "mute",
  UNMUTE: "unmute",
};

export default socket;
