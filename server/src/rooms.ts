import { customAlphabet } from "nanoid";
import type { Player, Room } from "./types.js";

export const rooms: Record<string, Room> = {};
const roomTimeouts: Record<string, NodeJS.Timeout> = {};

const generateRoomCode = customAlphabet(
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
	5,
);

export function createRoom(hostID: string) {
	let roomCode: string;
	do {
		roomCode = generateRoomCode();
	} while (rooms[roomCode]);

	rooms[roomCode] = {
		players: [],
		hostId: hostID,
		messages: [],
		bannedIDs: [],
	};

	return roomCode;
}

export function joinRoom(roomCode: string, player: Player) {
	const room = rooms[roomCode];

	if (!room) {
		return {
			success: false,
			message: "room does not exists",
		};
	}

	if (room.bannedIDs.includes(player.id)) {
		return {
			success: false,
			message: "you have been banned from this room",
		};
	}

	if (roomTimeouts[roomCode]) {
		clearTimeout(roomTimeouts[roomCode]);
		delete roomTimeouts[roomCode];
	}

	const existingPlayer = room.players.find((p) => p.id === player.id);
	if (existingPlayer) {
		const wasOffline = !existingPlayer.isOnline;

		existingPlayer.socketId = player.socketId;
		existingPlayer.name = player.name;
		existingPlayer.isOnline = true;
		if (wasOffline) {
			return {
				success: true,
				message: "player rejoined",
			};
		} else {
			return {
				success: true,
				message: "strict mode",
			};
		}
	}

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

	const player = room.players.find((p) => p.socketId === socketId);
	if (player) player.isOnline = false;

	const isRoomEmpty = room.players.every((p) => p.isOnline === false);
	if (isRoomEmpty) {
		roomTimeouts[roomCode] = setTimeout(
			() => {
				delete rooms[roomCode];
				delete roomTimeouts[roomCode];
			},
			3 * 60 * 1000,
		);
	}
}

export function getRoom(roomCode: string) {
	return rooms[roomCode];
}

export function kickPlayer({
	roomCode,
	playerId,
}: {
	roomCode: string;
	playerId: string;
}) {
	const room = getRoom(roomCode);
	if (!room) return;

	room.players = room.players.filter((player) => player.id != playerId);

	room.bannedIDs.push(playerId);
}
