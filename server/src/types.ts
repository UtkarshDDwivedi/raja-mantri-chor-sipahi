export type Player = {
    id: string,
    name: string,
}

export type Room = {
	players: Player[];
	hostId: string;
};