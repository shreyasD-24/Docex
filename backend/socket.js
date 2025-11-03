import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const ACTIONS = {
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

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    socket.join(roomId);
    socket.to(roomId).emit(ACTIONS.JOINED, {
      socketId: socket.id,
      userName: userName,
    });
  });

  socket.on(ACTIONS.UPDATE, ({ data, roomId }) => {
    socket.to(roomId).emit(ACTIONS.UPDATE, {
      data,
    });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ data, socketId, userList }) => {
    socket.to(socketId).emit(ACTIONS.UPDATE, { data });
    socket.to(socketId).emit(ACTIONS.GETUSERS, { users: userList });
  });

  socket.on(ACTIONS.OFFER, (payload) => {
    socket.to(payload.target).emit(ACTIONS.OFFER, {
      sdp: payload.sdp,
      caller: socket.id,
    });
  });

  socket.on(ACTIONS.ANSWER, (payload) => {
    socket.to(payload.target).emit(ACTIONS.ANSWER, {
      sdp: payload.sdp,
      caller: socket.id,
    });
  });

  socket.on(ACTIONS.ICE_CANDIDATE, (payload) => {
    socket.to(payload.target).emit(ACTIONS.ICE_CANDIDATE, {
      candidate: payload.candidate,
      caller: socket.id,
    });
  });

  socket.on(ACTIONS.UNMUTE, ({ socketId, roomId }) => {
    io.to(roomId).emit(ACTIONS.UNMUTE, {
      socketId,
    });
  });

  socket.on(ACTIONS.MUTE, ({ socketId, roomId }) => {
    io.to(roomId).emit(ACTIONS.MUTE, {
      socketId,
    });
  });

  socket.on(ACTIONS.LEAVEROOM, ({ roomId }) => {
    socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
      socketId: socket.id,
    });
    socket.leave(roomId);
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
      });
      socket.leave(roomId);
    });
  });
});

export default httpServer;
