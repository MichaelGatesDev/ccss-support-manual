import { Device } from "./device";

export interface Speakers extends Device {
    speakerType: SpeakerType;
}

export enum SpeakerType {
    Mounted,
    Desktop,
    Ceiling,
    Other
}


export class SpeakersFactory {

    private _device: Device;

    private _type: SpeakerType = SpeakerType.Other;

    public constructor(device: Device) {
        this._device = device;
    }

    public ofType(type: SpeakerType): SpeakersFactory {
        this._type = type;
        return this;
    }

    public build(): Speakers {
        return {
            ...this._device,
            speakerType: this._type
        };
    }
}