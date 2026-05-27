import { Shuffle } from "lucide-react";
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from "unique-names-generator";
import { motion } from "motion/react";

type UserInput = {
	userName: string;
	setUserName: React.Dispatch<React.SetStateAction<string>>;
};

export default function UserName({ userName, setUserName }: UserInput) {
	function handleShuffle() {
		const randomName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
            style: "capital"
		});
		setUserName(randomName);
	}

	return (
		<div className="flex justify-center items-center gap-4 w-fit relative top-3">
			<input
				type="text"
				value={userName}
				onChange={(e) => setUserName(e.target.value)}
				maxLength={32}
				className="w-50 h-10 md:w-75 md:h-14 md:text-2xl rounded-lg border-3 shadow-[-4px_4px_0px_0px_#9333ea] bg-cream text-center font-primary"
			/>
			<motion.div
				whileTap={{ scale: 0.97 }}
				className="w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-lg bg-purple shadow-[-4px_4px_0px_0px_black] cursor-pointer"
				onClick={handleShuffle}
			>
				<Shuffle size={26} color="#fff7eb" />
			</motion.div>
		</div>
	);
}
