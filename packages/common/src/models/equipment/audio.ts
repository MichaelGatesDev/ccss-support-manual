import { DeviceType, Device } from "./device";

/**
 * 
 */
export interface Audio {
    systemDependent?: boolean;

    audioDevices: Map<DeviceType, Device[]>;
}


export class AudioFactory {

    private _systemDependent: boolean = false;
    private _audioDevices: Map<DeviceType, Device[]> = new Map<DeviceType, Device[]>();;

    public isSystemDependent(dependent: boolean): AudioFactory {
        this._systemDependent = dependent;
        return this;
    }

    public withAudioDevices(devices: Map<DeviceType, Device[]>): AudioFactory {
        this._audioDevices = devices;
        return this;
    }

    public build(): Audio {
        return {
            systemDependent: this._systemDependent,
            audioDevices: this._audioDevices
        };
    }
}