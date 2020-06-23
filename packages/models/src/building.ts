import { Room } from "./room";

export interface Building {
  /**
   * Official Name of the building. (e.g. "Myers Fine Arts Building")
   */
  name: string;

  /**
   * Nicknames/abbreviations that a building may have.
   */
  nicknames: string[];

  /**
   * An array of Room objects representing the rooms in the building
   */
  rooms: Room[];

  /**
   * A relative path to the cover image file, or blank if none
   */
  coverImage: string;
}
