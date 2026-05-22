import JoinRoom from "../components/JoinRoom";

export default function Home() {
	return (
		<div className="flex flex-col gap-10 md:gap-30 p-10 md:flex-row justify-center items-center font-primary font-bold text-2xl md:text-4xl text-[#fff7eb] text-center">
			<div className="w-75 h-45 rounded-2xl md:w-120 md:h-65 md:rounded-3xl bg-[#f9ce57] shadow-[-5px_5px_0px_0px_black] md:shadow-[-8px_8px_0px_0px_black]"></div>
			<JoinRoom />
		</div>
	);
}
