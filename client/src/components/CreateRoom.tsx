import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CreateRoom() {
    const [copied, setCopied] = useState(false);

	const code: string = "-----";

	async function handleCopy() {
		try {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(code);
			} else {
				fallbackCopy(code);
			}

			setCopied(true);

			setTimeout(() => {
				setCopied(false);
			}, 1500);
		} catch {
			fallbackCopy(code);
		}
	}

	function fallbackCopy(text: string) {
		const textArea = document.createElement("textarea");

		textArea.value = text;

		document.body.appendChild(textArea);

		textArea.select();

		document.execCommand("copy");

		document.body.removeChild(textArea);
	}

	return (
		<div className="w-75 h-45 p-3 md:p-5 rounded-2xl md:w-120 md:h-65 md:rounded-3xl bg-[#f9ce57] flex flex-col gap-3 md:gap-4 items-center shadow-[-5px_5px_0px_0px_black] md:shadow-[-8px_8px_0px_0px_black]">
			<h2>Host the Game</h2>
			<div className="flex flex-col gap-4 md:gap-6 items-center justify-center">
				<div className="flex gap-2 md:gap-4">
					{[...code].map((char, index) => (
						<div
							key={index}
							className="flex justify-center items-center h-10 w-10 md:h-14 md:w-14 rounded-lg bg-[#fff7eb] text-black shadow-[-4px_4px_0_0_black] md:shadow-[-6px_6px_0_0_black]"
						>
							{char}
						</div>
					))}
				</div>
				<div className="flex justify-center items-center gap-2 md:gap-4">
					<motion.button
						whileTap={{ scale: 0.97 }}
						className="p-2 md:p-4 w-fit rounded-2xl bg-[#4eafff] cursor-pointer"
					>
						Create Room
					</motion.button>
					<motion.button
						whileTap={{ scale: 0.97 }}
						className="flex justify-center items-center p-2 md:p-4 w-fit rounded-2xl bg-[#4eafff] cursor-pointer"
						onClick={handleCopy}
					>
						{copied ? <Check /> : <Copy />}
					</motion.button>
				</div>
			</div>
		</div>
	);
}
