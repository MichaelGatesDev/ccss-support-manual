import { SimpleRoom } from "./room";

export interface TroubleshootingData {
  title: string;
  description: string;
  solution: string;
  tags: string[];
  whitelistedRooms: SimpleRoom[];
  blacklistedRooms: SimpleRoom[];
}
