import { Device } from "./device";

export interface Projector extends Device {
    mounted: boolean;
}


export class ProjectorFactory {

    private _device: Device;

    private _mounted = false;

    public constructor(device: Device) {
        this._device = device;
    }

    public isMounted(mounted: boolean): ProjectorFactory {
        this._mounted = mounted;
        return this;
    }

    public build(): Projector {
        return {
            ...this._device,
            mounted: this._mounted
        };
    }
}