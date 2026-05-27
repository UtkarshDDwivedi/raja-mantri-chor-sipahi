import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types.ts";
import socket from "../services/socket";

import Controlbar from "../components/Controlbar.tsx";
import GamePanel from "../components/GamePanel.tsx";
import PlayerPanel from "../components/PlayerPanel.tsx";
import ChatPanel from "../components/ChatPanel.tsx";

import { motion } from "motion/react";

export default function Room() {
	const [message, setMessage] = useState("");

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

	function handleChat(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!message.trim()) return;

		if (!socket.connected) socket.connect();

		socket.emit("send_message", message);
		setMessage("");
	}

	return (
		<div className="min-h-screen flex flex-col items-center p-4 font-primary">
			<Controlbar roomCode={roomCode} />
			<div className="flex flex-col md:flex-row-reverse justify-center items-center gap-4">
				<GamePanel />
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex md:flex-col justify-center items-center gap-4">
						<PlayerPanel />
						<ChatPanel />
					</div>
					<form
						onSubmit={(e) => handleChat(e)}
						className="flex justify-between gap-2 w-full text-cream font-bold"
					>
						<input
							type="text"
							placeholder="Send Message"
							value={message}
							onChange={(e) => {
								setMessage(e.target.value);
							}}
							className="w-full rounded-lg p-2 bg-purple"
						/>
						<motion.button
							whileTap={{ scale: 0.97 }}
							className="p-2 rounded-lg cursor-pointer bg-pink"
						>
							Send
						</motion.button>
					</form>
				</div>
			</div>
		</div>
	);
}
