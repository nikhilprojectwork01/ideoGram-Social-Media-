import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

const userSocketmap = {}

export const getReceiverSocketId = (recieverid) => {
  return userSocketmap[recieverid]
}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId

  if (userId !== undefined) {
    userSocketmap[userId] = socket.id
  }
  io.emit('getOnlineUsers', Object.keys(userSocketmap))
  socket.on('disconnect', () => {
    delete userSocketmap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketmap))
  })
})

export { app, io, server };