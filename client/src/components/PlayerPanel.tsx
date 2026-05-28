type PlayerPanelProps = {
    activePanel: "chat" | "player";
    setActivePanel: (panel: "chat" | "player") => void;
};

export default function PlayerPanel({ activePanel, setActivePanel }: PlayerPanelProps) {
    

	return (
        <div 
            onClick={() => setActivePanel("player")}
            className={`min-w-0 min-h-0 bg-blue rounded-xl shadow-[-6px_6px_0_0_#9333ea] transition-all duration-300 ease-in-out cursor-pointer
            ${activePanel === "player" ? "flex-3" : "flex-1"} 
            md:flex-1 md:w-full md:h-full`}
        >
            Player Panel
        </div>
    );
}
