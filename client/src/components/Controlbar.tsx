import { Copy, Share2, Settings, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Controlbar({
	roomCode,
}: {
	roomCode: string | undefined;
}) {
	const [copied, setCopied] = useState(false);
	const [shared, setShared] = useState(false);

	async function handleCopy(text: string | undefined) {
		if (text) {
			try {
				if (navigator.clipboard) {
					await navigator.clipboard.writeText(text);
				} else {
					fallbackCopy(text);
				}

				setCopied(true);

				setTimeout(() => {
					setCopied(false);
				}, 1500);
			} catch {
				fallbackCopy(text);
			}
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

	async function handleShare() {
		if (roomCode) {
			try {
				if (navigator.share) {
					await navigator.share({
						title: "Join my Raja Mantri Chor Sipahi Game!",
						text: `Join my Raja Mantri Chor Sipahi Game.\nRoom Code: ${roomCode}\n`,
						url: window.location.href,
					});

					setShared(true);
					setTimeout(() => {
						setShared(false);
					}, 1500);
				} else {
					handleCopy(window.location.href);
					setShared(true);
					setTimeout(() => {
						setShared(false);
					}, 1500);
					alert("Room link copied!");
				}
			} catch (err) {
				console.error("Failed to share:", err);
			}
		}
	}

	return (
		<div className="flex justify-center items-center gap-37 text-2xl p-2 border-3 rounded-xl bg-cream shadow-[-4px_4px_0px_0px_#9333ea] mb-4">
			<div className="flex justify-center items-center gap-4">
				<h2>{roomCode}</h2>
				<motion.button
					whileTap={{ scale: 0.97 }}
					className="cursor-pointer "
					onClick={() => handleCopy(roomCode)}
				>
					{copied ? <Check /> : <Copy />}
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.97 }}
					className="cursor-pointer "
					onClick={handleShare}
				>
					{shared ? <Check /> : <Share2 />}
				</motion.button>
			</div>
			<motion.button
				whileTap={{ scale: 0.97 }}
				className="cursor-pointer "
			>
				<Settings />
			</motion.button>
		</div>
	);
}
