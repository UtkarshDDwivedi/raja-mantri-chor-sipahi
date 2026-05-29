export type Player = {
    id: string,
    socketId: string,
    name: string,
    score: number,
    isOnline: boolean;
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
    bannedIDs: string[]; 
};