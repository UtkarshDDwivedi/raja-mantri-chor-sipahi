export type Player = {
    id: string,
    name: string,
}

export type Message = {
    senderId: string,
    senderName: string,
    text: string,
}

export type Room = {
	players: Player[];
	hostId: string;
    messages: Message[];
};