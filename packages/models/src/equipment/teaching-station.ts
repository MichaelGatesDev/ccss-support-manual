import { TeachingStationComputer, TeachingStationComputerFactory, ComputerFactory } from "./computer";
import { DeviceFactory, DeviceType } from "./device";

export interface TeachingStation {
    type: TeachingStationType;
    teachingStationComputer: TeachingStationComputer;
}

export enum TeachingStationType {
    Digital,
    Analog,
    Other
}

export class TeachingStationFactory {
    private _type: TeachingStationType = TeachingStationType.Other;
    private _computer: TeachingStationComputer = new TeachingStationComputerFactory(new ComputerFactory(new DeviceFactory().ofType(DeviceType.Computer).build()).build()).build();

    public constructor() { }

    public ofType(type: TeachingStationType): TeachingStationFactory {
        this._type = type;
        return this;
    }

    public withComputer(computer: TeachingStationComputer): TeachingStationFactory {
        this._computer = computer;
        return this;
    }

    public build(): TeachingStation {
        return {
            type: this._type,
            teachingStationComputer: this._computer
        };
    }
}