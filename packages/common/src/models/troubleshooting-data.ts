import { SimpleRoom } from "./room";


export interface TroubleshootingData {
    title: string;
    description: string;
    solution: string;
    types: string[];
    tags: string[];
    whitelistedRooms: SimpleRoom[];
    blacklistedRooms: SimpleRoom[];
}

