import { customAlphabet } from "nanoid";
import type { Player, Room } from "./types.js";

export const rooms: Record<string, Room> = {};

const generateRoomCode = customAlphabet(
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
	5,
);

export function createRoom(player: Player) {
	let roomCode: string;
	do {
		roomCode = generateRoomCode();
	} while (rooms[roomCode]);

	rooms[roomCode] = { players: [player], hostId: player.id, messages: []};

	return roomCode;
}

export function joinRoom(roomCode: string, player: Player) {
	const room = rooms[roomCode];

	if (!room)
		return {
			success: false,
			message: "room does not exists",
		};

	if (room.players.length >= 10)
		return {
			success: false,
			message: "room full",
		};

	room.players.push(player);
	return {
		success: true,
		message: "player joined",
	};
}

export function removePlayer(socketId: string, roomCode: string) {
	const room = rooms[roomCode];
	if (!room) return;

	room.players = room.players.filter((player) => player.id !== socketId);

	if (room.players.length === 0) {
		delete rooms[roomCode];
	}
}

export function getRoom(roomCode: string) {
	return rooms[roomCode];
}