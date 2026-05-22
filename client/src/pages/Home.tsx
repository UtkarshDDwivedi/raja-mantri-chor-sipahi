import JoinRoom from "../components/JoinRoom";
import CreateRoom from "../components/CreateRoom";

export default function Home() {
	return (
		<div className="flex flex-col gap-10 md:gap-30 p-10 md:flex-row justify-center items-center font-primary font-bold text-2xl md:text-4xl text-[#fff7eb] text-center">
			<CreateRoom />
			<JoinRoom />
		</div>
	);
}
