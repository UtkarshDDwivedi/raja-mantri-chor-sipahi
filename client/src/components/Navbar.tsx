import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

type Position = {
	left: number;
	width: number;
	opacity: number;
};

export default function Navbar() {
	const [position, setPosition] = useState<Position>({
		left: 0,
		width: 0,
		opacity: 0,
	});

	return (
		<nav className="relative min-w-screen flex justify-center p-4">
			<ul className="flex justify-center items-center rounded-full border-2 w-fit bg-white px-1">
				<Tab setPosition={setPosition} text="Home" path="/" />
				<Tab
					setPosition={setPosition}
					text="How to Play?"
					path="/how-to-play"
				/>

				<Cursor position={position} />
			</ul>
		</nav>
	);
}

function Tab({
	text,
	setPosition,
	path,
}: {
	text: string;
	setPosition: Dispatch<SetStateAction<Position>>;
	path: string;
}) {
	const ref = useRef<HTMLLIElement>(null);
	return (
		<li
			ref={ref}
			onMouseEnter={() => {
				if (!ref.current) return;

				const { width } = ref.current.getBoundingClientRect();

				setPosition({
					width,
					opacity: 1,
					left: ref.current.offsetLeft,
				});
			}}
			onMouseLeave={() => {
				setPosition((p) => ({
					...p,
					opacity: 0,
				}));
			}}
			className="relative z-10 block cursor-pointer text-white mix-blend-difference text-xl py-3 px-3 md:py-2"
		>
			<Link to={path}>{text}</Link>
		</li>
	);
}

function Cursor({ position }: { position: Position }) {
	return (
		<motion.li
			animate={position}
			transition={{
				type: "spring",
				bounce: 0.5,
			}}
			className="absolute z-0 h-10 md:h-9 rounded-full bg-black"
		></motion.li>
	);
}
