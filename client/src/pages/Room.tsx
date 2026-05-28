import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types.ts";
import socket from "../services/socket";

import Controlbar from "../components/Controlbar.tsx";
import GamePanel from "../components/GamePanel.tsx";
import PlayerPanel from "../components/PlayerPanel.tsx";
import ChatPanel from "../components/ChatPanel.tsx";

import { motion } from "motion/react";

export default function Room({ userName }: { userName: string }) {
	const [message, setMessage] = useState("");
	const [activePanel, setActivePanel] = useState<"chat" | "player">("chat");

	const { roomCode } = useParams();
	const [room, setRoom] = useState<Room | null>(null);
	const navigate = useNavigate();
	const [isJoining, setIsJoining] = useState(true);

	useEffect(() => {
		if (!roomCode || !userName) return;
		if (!socket.connected) socket.connect();

		socket.emit("join_room", { roomCode, playerName: userName });

		function handleJoinSuccess() {
			setIsJoining(false);
			socket.emit("get_room", roomCode);
		}

		function handleJoinError(errorMessage: string) {
			alert(errorMessage);
			navigate("/");
		}

		function handleRoomData(data: Room) {
			setRoom(data);
		}

		socket.on("join_success", handleJoinSuccess);
		socket.on("join_error", handleJoinError);
		socket.on("room_data", handleRoomData);

		return () => {
			socket.off("join_success", handleJoinSuccess);
			socket.off("join_error", handleJoinError);
			socket.off("room_data", handleRoomData);
		};
	}, [roomCode, userName, navigate]);

	if (isJoining || !room) {
		return (
			<div className="h-dvh flex items-center justify-center font-primary text-cream text-2xl font-bold">
				Joining Room...
			</div>
		);
	}

	function handleChat(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!message.trim()) return;

		if (!socket.connected) socket.connect();

		socket.emit("send_message", message);
		setMessage("");
	}

	return (
		<div className="h-dvh flex flex-col items-center p-4 font-primary">
			<Controlbar roomCode={roomCode} />
			<div className="flex-1 w-full mx-auto flex flex-col md:flex-row-reverse gap-4 min-h-0">
				<div className="flex-3 flex flex-col min-h-0 w-full">
					<GamePanel />
				</div>

				<div className="flex-2 md:flex-1 flex flex-col gap-4 min-w-75 min-h-0">
					<div className="flex-1 flex flex-row md:flex-col gap-4 min-h-0">
						<PlayerPanel
							activePanel={activePanel}
							setActivePanel={setActivePanel}
						/>
						<ChatPanel
							activePanel={activePanel}
							setActivePanel={setActivePanel}
						/>
					</div>

					<form
						onSubmit={(e) => handleChat(e)}
						className="flex justify-between gap-2 w-full text-cream font-bold shrink-0"
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
							className="p-2 rounded-lg cursor-pointer bg-pink shrink-0"
						>
							Send
						</motion.button>
					</form>
				</div>
			</div>
		</div>
	);
}
