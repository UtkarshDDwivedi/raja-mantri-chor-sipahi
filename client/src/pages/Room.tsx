import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../../../shared/types.ts";
import socket from "../services/socket";

import HostControls from "../components/HostControls.tsx";
import PlayerWaiting from "../components/PlayerWaiting.tsx";
import Controlbar from "../components/Controlbar.tsx";

export default function Room() {
	const { roomCode } = useParams();
	const [room, setRoom] = useState<Room | null>(null);

	useEffect(() => {
		if (!roomCode) return;
		if (!socket.connected) socket.connect();

		function handleRoomData(data: Room) {
			setRoom(data);
		}
		socket.emit("get_room", roomCode);
		socket.on("room_data", handleRoomData);

		return () => {
			socket.off("room_data", handleRoomData);
		};
	}, [roomCode]);

	if (!room) return <div className="min-h-screen">Loading...</div>;

	const isHost = socket.id && socket.id === room.hostId;

	return (
		<div className="min-h-screen flex flex-col items-center p-4 font-primary">
			<Controlbar roomCode={roomCode} />
			{isHost ? <HostControls /> : <PlayerWaiting />}
		</div>
	);
}
