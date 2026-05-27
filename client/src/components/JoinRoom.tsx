import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Trash, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import socket from "../services/socket";

export default function JoinRoom({ userName }: { userName: string }) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		function handleRoomJoined(roomCode: string) {
			setLoading(false);
			navigate(`/room/${roomCode}`);
		}

		socket.on("join_success", handleRoomJoined);

		return () => {
			socket.off("join_success", handleRoomJoined);
		};
	}, [navigate]);

	useEffect(() => {
		function handleJoinError(message: string) {
			setLoading(false);

			alert(message);
		}

		socket.on("join_error", handleJoinError);

		return () => {
			socket.off("join_error", handleJoinError);
		};
	}, []);

	const CODE_LENGTH = 5;

	const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));

	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	function handleChange(value: string, index: number) {
		const newCode = [...code];
		newCode[index] = value.toUpperCase();
		setCode(newCode);

		if (value && index < CODE_LENGTH - 1)
			inputsRef.current[index + 1]?.focus();
	}

	function handleKeyDown(
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) {
		const newCode = [...code];
		if (e.key === "Backspace") {
			if (newCode[index]) {
				newCode[index] = "";
				setCode(newCode);
				return;
			}
			if (index > 0) {
				inputsRef.current[index - 1]?.focus();
			}
		} else if (e.key === "ArrowLeft") {
			if (index > 0) inputsRef.current[index - 1]?.focus();
		} else if (e.key === "ArrowRight") {
			if (index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
		}
	}

	function pasteData(data: string) {
		const newCode = Array(CODE_LENGTH).fill("");
		for (let i = 0; i < CODE_LENGTH; i++) if (data[i]) newCode[i] = data[i];
		setCode(newCode);

		const nextIndex = Math.min(data.length, CODE_LENGTH - 1);
		inputsRef.current[nextIndex]?.focus();
	}

	function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
		e.preventDefault();

		const data = e.clipboardData.getData("text").toUpperCase();

		pasteData(data);
	}

	const [cleared, setCleared] = useState(false);

	function handleClear() {
		const newCode = Array(CODE_LENGTH).fill("");
		setCode(newCode);
		inputsRef.current[0]?.focus();

		setCleared(true);
		setTimeout(() => {
			setCleared(false);
		}, 1500);
	}

	function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (loading) return;

		setLoading(true);
		if (!socket.connected) socket.connect();

		const roomCode = code.join("");
		socket.emit("join_room", { roomCode: roomCode, playerName: userName });
	}

	return (
		<div className="w-75 h-45 p-3 md:p-5 rounded-2xl md:w-120 md:h-65 md:rounded-3xl bg-blue flex flex-col gap-3 md:gap-4 items-center shadow-[-5px_5px_0px_0px_black] md:shadow-[-8px_8px_0px_0px_black]">
			<h2>Can you find the CHOR?</h2>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="flex flex-col gap-4 md:gap-6 items-center justify-center"
			>
				<div className="flex gap-2 md:gap-4">
					{code.map((digit, index) => (
						<input
							key={index}
							value={digit}
							ref={(element) => {
								inputsRef.current[index] = element;
							}}
							onChange={(e) =>
								handleChange(e.target.value, index)
							}
							onKeyDown={(e) => handleKeyDown(e, index)}
							onPaste={handlePaste}
							maxLength={1}
							className="text-center h-10 w-10 md:h-14 md:w-14 rounded-lg bg-cream text-black shadow-[-4px_4px_0_0_black] md:shadow-[-6px_6px_0_0_black]"
						/>
					))}
				</div>
				<div className="flex justify-center items-center gap-2 md:gap-4">
					<motion.button
						type="submit"
						whileTap={{ scale: 0.97 }}
						className="p-2 md:p-4 w-fit rounded-2xl bg-yellow cursor-pointer"
					>
						{loading ? "Joining..." : "Join Room"}
					</motion.button>
					<motion.button
						type="button"
						whileTap={{ scale: 0.97 }}
						className="flex justify-center items-center p-2 md:p-4 w-fit rounded-2xl bg-yellow cursor-pointer"
						onClick={handleClear}
					>
						{cleared ? <Check /> : <Trash />}
					</motion.button>
				</div>
			</form>
		</div>
	);
}
