import { DeviceType, Device } from "./device";

export interface Video {
    videoDevices: Map<DeviceType, Device[]>;
}