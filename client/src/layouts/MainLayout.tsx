import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Banner from "../assets/banner.svg?react";
import UserName from "../components/UserName";

interface MainLayoutProps {
	userName: string;
	setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export default function MainLayout({ userName, setUserName }: MainLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<Navbar />

			<Banner className="md:h-65" />

			<UserName userName={userName} setUserName={setUserName} />

			<Outlet />
		</div>
	);
}
