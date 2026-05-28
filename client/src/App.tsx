import { useEffect, useState } from "react";

import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";
import Room from "./pages/Room";

import {
	uniqueNamesGenerator,
	animals,
	adjectives,
} from "unique-names-generator";

function App() {
	const [playerID] = useState(() => {
		const savedID = localStorage.getItem("playerID");
		if (savedID) return savedID;

		const newID = crypto.randomUUID();
		localStorage.setItem("playerID", newID);
		return newID;
	})

	const [userName, setUserName] = useState(() => {
		const savedName = localStorage.getItem("playerName");
		if (savedName) return savedName;

		const randomName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			style: "capital",
		});
		localStorage.setItem("playerName", randomName);
		return randomName;
	});

	useEffect(() => {
		if (userName) localStorage.setItem("playerName", userName);
	}, [userName]);

	return (
		<Routes>
			<Route
				element={
					<MainLayout userName={userName} setUserName={setUserName} />
				}
			>
				<Route path="/" element={<Home playerID={playerID} />} />
				<Route path="/how-to-play" element={<HowToPlay />} />
			</Route>

			<Route path="/room/:roomCode" element={<Room userName={userName} playerID={playerID}/>} />
		</Routes>
	);
}

export default App;
