import { useRef, useState } from "react";
import { motion } from "motion/react";

export default function JoinRoom() {
	const CODE_LENGTH = 5;

	const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));

	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	function handleChange(value: string, index: number) {
		const newCode = [...code];
		newCode[index] = value.toUpperCase();
		setCode(newCode);

		if (value && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
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

	function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
		e.preventDefault();

		const data = e.clipboardData.getData("text").toUpperCase();
		
		const newCode = Array(CODE_LENGTH).fill("");
		for (let i = 0; i < CODE_LENGTH; i++) if(data[i]) newCode[i] = data[i];
		setCode(newCode);

		const nextIndex = Math.min(data.length, CODE_LENGTH - 1);
		inputsRef.current[nextIndex]?.focus();
	}

	function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		const roomCode = code.join("");
		console.log("Room Code: ", roomCode);
	}

	return (
		<div className="w-75 h-45 p-3 md:p-5 rounded-2xl md:w-120 md:h-65 md:rounded-3xl bg-[#4eafff] flex flex-col gap-3 md:gap-4 items-center shadow-[-5px_5px_0px_0px_black] md:shadow-[-8px_8px_0px_0px_black]">
			<h2>Can you find the CHOR?</h2>
			<form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 md:gap-6 items-center justify-center">
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
							className="text-center h-10 w-10 md:h-14 md:w-14 rounded-lg bg-[#fff7eb] text-black shadow-[-4px_4px_0_0_black] md:shadow-[-6px_6px_0_0_black]"
						/>
					))}
				</div>
				<motion.button
					type="submit"
					whileTap={{scale: 0.97}}
					className="p-2 md:p-4 w-fit rounded-2xl bg-[#f9ce57] cursor-pointer"
				>
					Join Room
				</motion.button>
			</form>
		</div>
	);
}
