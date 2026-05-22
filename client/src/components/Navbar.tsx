import {
	useRef,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import { easeInOut, motion } from "motion/react";
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
		<nav className="relative min-w-screen flex justify-center p-4 font-primary">
			<ul className="flex justify-center items-center rounded-full border-3 w-fit bg-[#FFF7E8] px-1 shadow-[-4px_4px_0px_0px_#9333ea]">
				<Tab setPosition={setPosition} path="/">
					Home
				</Tab>
				<Tab setPosition={setPosition} path="/how-to-play">
					How to Play?
				</Tab>

				<Cursor position={position} />
			</ul>
		</nav>
	);
}

function Tab({
	children,
	setPosition,
	path,
}: {
	children: ReactNode;
	setPosition: Dispatch<SetStateAction<Position>>;
	path: string;
}) {
	const ref = useRef<HTMLLIElement>(null);
	const [color, setColor] = useState('#000000')
	return (
		<motion.li
			ref={ref}
			onMouseEnter={() => {
				if (!ref.current) return;

				const { width } = ref.current.getBoundingClientRect();

				setPosition({
					width,
					opacity: 1,
					left: ref.current.offsetLeft,
				});

				setColor('#FFF7EB');
			}}
			onMouseLeave={() => {
				setPosition((p) => ({
					...p,
					opacity: 0,
				}));

				setColor('#000000');
			}}
			animate={{color}}
			transition={{duration: 0.3, ease:easeInOut}}
			className="relative z-10 block cursor-pointer text-xl md:text-2xl font-medium py-2 px-3 md:py-3"
		>
			<Link to={path} className="flex justify-center items-center">
				{children}
			</Link>
		</motion.li>
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
			className="absolute z-0 h-10 md:h-11 rounded-full bg-[#A855F7]"
		></motion.li>
	);
}
