import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import { createRoom, joinRoom, removePlayer, getRoom, rooms } from "./rooms.js";
import type { Message } from "./types.js";

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(
	cors({
		origin: CLIENT_URL,
	}),
);
const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: CLIENT_URL,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("create_room", (playerID: string) => {
		const roomCode = createRoom(playerID);
		socket.emit("room_created", roomCode);
	});

	socket.on(
		"join_room",
		({
			roomCode,
			playerName,
			playerID,
		}: {
			roomCode: string;
			playerName: string;
			playerID: string;
		}) => {
			const result = joinRoom(roomCode, {
				id: playerID,
				socketId: socket.id,
				name: playerName,
				score: 0,
				isOnline: true,
			});
			if (result.success) {
				socket.join(roomCode);
				socket.data.roomCode = roomCode;
				socket.data.playerName = playerName;
				socket.emit("join_success", roomCode);
				io.to(roomCode).emit("player_joined", playerName);
				return;
			}
			socket.emit("join_error", result.message);
		},
	);

	socket.on("disconnect", () => {
		const roomCode = socket.data.roomCode;
		if (!roomCode) return;

		removePlayer(socket.id, roomCode);
	});

	socket.on("get_room", (roomCode: string) => {
		const room = getRoom(roomCode);
		socket.emit("room_data", room);
	});

	socket.on("get_messages", () => {
		const roomCode = socket.data.roomCode;
		const room = getRoom(roomCode);
		socket.emit("message_data", room?.messages);
	});

	socket.on("send_message", (message: string) => {
		const newMessage: Message = {
			senderId: socket.id,
			senderName: socket.data.playerName,
			text: message,
		};

		const roomCode = socket.data.roomCode;
		const room = getRoom(roomCode);
		room?.messages.push(newMessage);
		io.to(roomCode).emit("received_message", newMessage);
	});
});

server.listen(PORT, () => {
	console.log(`server started on http://localhost:${PORT}`);
});
