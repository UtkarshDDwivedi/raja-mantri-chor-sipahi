import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";
import type { Message } from "../types";

type ChatPanelProps = {
	activePanel: "chat" | "player";
	setActivePanel: (panel: "chat" | "player") => void;
	playerId: string;
};

export default function ChatPanel({
	activePanel,
	setActivePanel,
	playerId,
}: ChatPanelProps) {
	const [messages, setMessages] = useState<Message[]>([]);

	const messageEndRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!socket.connected) socket.connect();

		function handleMessagesData(messagesData: Message[]) {
			setMessages(messagesData);
		}
		socket.emit("get_messages");
		socket.on("message_data", handleMessagesData);

		function handleNewMessage(newMessage: Message) {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}
		socket.on("received_message", handleNewMessage);

		return () => {
			socket.off("message_data", handleMessagesData);
			socket.off("received_message", handleNewMessage);
		};
	}, []);

	return (
		<div
			onClick={() => setActivePanel("chat")}
			className={`min-w-0 min-h-0 flex flex-col bg-pink rounded-xl shadow-[-6px_6px_0_0_#9333ea] p-1 px-3 text-cream transition-all duration-300 ease-in-out cursor-pointer
            ${activePanel === "chat" ? "flex-3" : "flex-1"} 
            md:flex-1 md:w-full md:h-full`}
		>
			<div className="flex justify-center items-center p-2">
				<h2
					className={`text-cream text-sm md:text-2xl font-bold ${activePanel === "chat" ? "bg-blue" : ""} md:bg-blue p-1 px-3 rounded-md transition-all`}
				>
					Chat
				</h2>
			</div>
			<div className="flex-1 overflow-y-auto no-scrollbar">
				{messages.map((message, index) => (
					<div key={index} className="wrap-break-word">
						<span
							className={`${playerId === message.senderId ? "text-green-400" : "text-gray-600"}`}
						>
							{message.senderName}:{" "}
						</span>{" "}
						{message.text}
					</div>
				))}
				<div ref={messageEndRef}></div>
			</div>
		</div>
	);
}
