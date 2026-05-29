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

import { Toaster } from "sonner";

function App() {
	const [playerID] = useState(() => {
		const savedID = localStorage.getItem("playerID");
		if (savedID) return savedID;

		const newID = crypto.randomUUID();
		localStorage.setItem("playerID", newID);
		return newID;
	});

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
		<>
			<Toaster
				position="top-right"
				toastOptions={{
					unstyled: true,
					classNames: {
						toast: "border-2 border-black shadow-[-4px_4px_0_0_black] font-bold font-primary rounded-xl p-4 flex items-center gap-3 w-full",

						success: "bg-blue text-cream",
						info: "bg-purple text-cream",
						error: "bg-red-500 text-cream",

						icon: "text-current",
					},
				}}
			/>
			<Routes>
				<Route
					element={
						<MainLayout
							userName={userName}
							setUserName={setUserName}
						/>
					}
				>
					<Route path="/" element={<Home playerID={playerID} />} />
					<Route path="/how-to-play" element={<HowToPlay />} />
				</Route>

				<Route
					path="/room/:roomCode"
					element={<Room userName={userName} playerID={playerID} />}
				/>
			</Routes>
		</>
	);
}

export default App;
