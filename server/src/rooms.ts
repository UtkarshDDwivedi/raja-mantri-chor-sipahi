import { customAlphabet } from "nanoid";
import type { Player, Room } from "./types.ts";

const rooms: Record<string, Room> = {};

const generateRoomCode = customAlphabet(
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
	5,
);

export function createRoom(player: Player) {
	let roomCode: string;
	do {
		roomCode = generateRoomCode();
	} while (rooms[roomCode]);

	rooms[roomCode] = { players: [player] };

	console.log(rooms);
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
