import { useEffect, useRef, useState } from "react";

import socket from "../services/socket";
import type { Message } from "../types";

export default function ChatPanel() {
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
		<div className="flex flex-col h-[35vh] overflow-y-auto w-[50vw] md:h-[38vh] md:w-[25vw] bg-pink rounded-xl shadow-[-6px_6px_0_0_#9333ea] p-1 px-3 text-cream no-scrollbar">
			{messages.map((message, index) => (
				<div key={index} className="wrap-break-word">
					<span
						className={`${socket.id === message.senderId ? "text-green-400" : "text-gray-600"}`}
					>
						{message.senderName}:{" "}
					</span>{" "}
					{message.text}
				</div>
			))}

			<div ref={messageEndRef}></div>
		</div>
	);
}
