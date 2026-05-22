import { customAlphabet } from "nanoid";
import type { Player, Room } from "./types.ts";

const rooms: Record<string, Room> = {};

const generateRoomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 5);

export function createRoom(player: Player) {
	let roomCode: string;
	do {
		roomCode = generateRoomCode();
	} while (rooms[roomCode]);

	rooms[roomCode] = { players: [player] };

    console.log(rooms);
	return roomCode;
}