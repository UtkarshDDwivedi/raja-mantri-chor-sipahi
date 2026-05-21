import Navbar from "./components/Navbar";
import Banner from "./assets/banner.svg?react"
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Banner className="md:h-80" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
      </Routes>
    </div>
  );
}

export default App;