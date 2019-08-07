import { Device } from "./device";

/**
 * A Document Camera
 */
export interface DocumentCamera extends Device {
    hasMicrophone?: boolean;
}


export class DocumentCameraFactory {

    private _device: Device;

    private _hasMicrophone: boolean = false;

    public constructor(device: Device) {
        this._device = device;
    }

    public hasMic(has: boolean): DocumentCameraFactory {
        this._hasMicrophone = has;
        return this;
    }

    public build(): DocumentCamera {
        return {
            ...this._device,
            hasMicrophone: this._hasMicrophone
        };
    }
}