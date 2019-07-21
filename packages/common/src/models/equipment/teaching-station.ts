import { TeachingStationComputer } from "./computer";

export interface TeachingStation {
    type?: TeachingStationType;
    _teachingStationComputer: TeachingStationComputer;
}

export enum TeachingStationType {
    Digital,
    Analog
}