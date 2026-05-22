import { useParams } from "react-router-dom";

export default function Room() {
	const { roomCode } = useParams();

	return (
		<div>
			<h1> Room: {roomCode} </h1>
		</div>
	);
}
