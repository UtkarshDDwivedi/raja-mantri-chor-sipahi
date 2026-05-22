import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import { createRoom } from "./rooms.ts";

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
        const roomCode = createRoom({id: socket.id, name: playerName});
		console.log(`${playerName} created room ${roomCode}`)
		socket.emit("room_created", roomCode);
    });
});

server.listen(PORT, () => {
	console.log(`server started on http://localhost:${PORT}`);
});
