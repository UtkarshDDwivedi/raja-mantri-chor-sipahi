export type Player = {
    id: string,
    name: string,
}

export type Room = {
	players: Player[];
	timeout?: NodeJS.Timeout;
};