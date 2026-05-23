import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import { createRoom, joinRoom, removePlayer, getRoom } from "./rooms.js";

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
	socket.on("create_room", (playerName: string) => {
		const roomCode = createRoom({ id: socket.id, name: playerName });
		socket.emit("room_created", roomCode);

		socket.join(roomCode);

		socket.data.roomCode = roomCode;
	});

	socket.on(
		"join_room",
		({
			roomCode,
			playerName,
		}: {
			roomCode: string;
			playerName: string;
		}) => {
			const result = joinRoom(roomCode, {
				id: socket.id,
				name: playerName,
			});
			if (result.success) {
				socket.join(roomCode);
				socket.data.roomCode = roomCode;
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
	})
});

server.listen(PORT, () => {
	console.log(`server started on http://localhost:${PORT}`);
});
