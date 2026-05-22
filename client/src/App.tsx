import Navbar from "./components/Navbar";
import Banner from "./assets/banner.svg?react";
import UserName from "./components/UserName";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";

import { useState } from "react";
import {
	uniqueNamesGenerator,
	animals,
	adjectives,
} from "unique-names-generator";

function App() {
	const [userName, setUserName] = useState(() =>
		uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			style: "capital",
		}),
	);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<Navbar />
			<Banner className="md:h-65" />

			<UserName userName={userName} setUserName={setUserName} />

			<Routes>
				<Route path="/" element={<Home userName={userName} />} />
				<Route path="/how-to-play" element={<HowToPlay />} />
			</Routes>
		</div>
	);
}

export default App;
