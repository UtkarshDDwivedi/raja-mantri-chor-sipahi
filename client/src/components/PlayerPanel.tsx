import { useEffect, useRef } from "react";
import type { Player } from "../types";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";
import socket from "../services/socket";

type PlayerPanelProps = {
	activePanel: "chat" | "player";
	setActivePanel: (panel: "chat" | "player") => void;
	playerId: string;
	hostId: string;
	players: Player[];
};

export default function PlayerPanel({
	activePanel,
	setActivePanel,
	playerId,
	hostId,
	players,
}: PlayerPanelProps) {
	const amIHost = playerId === hostId;

	const playersEndRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		playersEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [players]);

	function handleKickPlayer(playerId: string) {
		if (!socket.connected) socket.connect();
		
		socket.emit("kick_player", playerId);
	}
	return (
		<div
			onClick={() => setActivePanel("player")}
			className={`min-w-0 min-h-0 bg-blue rounded-xl shadow-[-6px_6px_0_0_#9333ea] text-cream text-xl transition-all duration-300 ease-in-out
            ${activePanel === "player" ? "flex-3" : "flex-1"} 
            md:flex-1 md:w-full md:h-full`}
		>
			<div className="flex justify-center items-center p-2">
				<h2
					className={`text-cream text-sm md:text-2xl font-bold ${activePanel === "player" ? "bg-pink" : ""} md:bg-pink p-1 px-3 rounded-md transition-all`}
				>
					Lobby
				</h2>
			</div>

			<div className="flex flex-col gap-3 overflow-y-auto no-scrollbar px-3">
				{players.map((player) => {
					const isMe = player.id === playerId;
					const isHost = player.id === hostId;

					return (
						<div
							key={player.id}
							className={`flex justify-between items-center wrap-break-word bg-green-500 ${player.isOnline ? "shadow-[-4px_4px_0_0_black]" : "grayscale shadow-[-4px_4px_0_0_black]"} p-1 px-2 rounded-lg cursor-default`}
						>
							<div className="flex-1 md:flex items-center gap-2 truncate">
								<span className="truncate">{player.name}</span>
								<span className="text-sm shrink-0 opacity-80">
									{isMe && "(You)"} {isHost && "(Host)"}
								</span>
							</div>
							<div
								className={`${activePanel === "player" ? "flex" : "hidden"} md:flex items-center gap-3 shrink-0`}
							>
								<span className="w-8 text-right">
									{player.score}
								</span>
								<motion.button
									onClick={() => handleKickPlayer(player.id)}
									whileTap={{ scale: 0.97 }}
									className="w-6 flex justify-end"
								>
									{amIHost && !isMe && (
										<LogOut
											className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
											strokeWidth={3}
											size={20}
										/>
									)}
								</motion.button>
							</div>
						</div>
					);
				})}
				<div ref={playersEndRef}></div>
			</div>
		</div>
	);
}
