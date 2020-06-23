import { Computer } from "./computer";

type TeachingStationType = "digital" | "analog" | "other";

export interface TeachingStation {
  type: TeachingStationType;
  teachingStationComputer: Computer;
}
