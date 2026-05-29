import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import {
	createRoom,
	joinRoom,
	removePlayer,
	getRoom,
	kickPlayer,
} from "./rooms.js";
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
				socket.data.playerId = playerID;
				socket.emit("join_success", roomCode);

				const room = getRoom(roomCode);
				io.to(roomCode).emit("room_data", room);

				if (
					result.message === "player joined" ||
					result.message === "player rejoined"
				)
					io.to(roomCode).emit("notification", {
						message: `${playerName} joined the lobby :)`,
						type: "success",
					});
				return;
			}
			socket.emit("join_error", result.message);
		},
	);

	socket.on("disconnect", () => {
		const roomCode = socket.data.roomCode;
		if (!roomCode) return;

		removePlayer(socket.id, roomCode);

		const room = getRoom(roomCode);
		io.to(roomCode).emit("room_data", room);

		const playerName = socket.data.playerName;
		io.to(roomCode).emit("notification", {
			message: `${playerName} left the lobby :(`,
			type: "info",
		});
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
			senderId: socket.data.playerId,
			senderName: socket.data.playerName,
			text: message,
		};

		const roomCode = socket.data.roomCode;
		const room = getRoom(roomCode);
		room?.messages.push(newMessage);
		io.to(roomCode).emit("received_message", newMessage);
	});

	socket.on("kick_player", (playerId: string) => {
		const roomCode = socket.data.roomCode;
		const room = getRoom(roomCode);
		const playerName = room?.players.find((p) => p.id === playerId)?.name;

		if (room?.hostId !== socket.data.playerId) return;

		kickPlayer({ roomCode, playerId });
		io.to(roomCode).emit("player_kicked", playerId);

		io.to(roomCode).emit("room_data", room);
		io.to(roomCode).emit("notification", { message: `${playerName} has been kicked out of the lobby :(`, type: "error" });
	});
});

server.listen(PORT, () => {
	console.log(`server started on http://localhost:${PORT}`);
});
