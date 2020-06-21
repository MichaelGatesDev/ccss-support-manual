import { SpeakerType } from "./speakers";

/**
 *
 */
export interface Audio {
  systemDependent?: boolean;

  speakerType?: SpeakerType;
  // audioDevices: Map<DeviceType, Device[]>;
}

export class AudioFactory {
  private _systemDependent = false;
  // private _audioDevices: Map<DeviceType, Device[]> = new Map<DeviceType, Device[]>();;
  private _speakerType: SpeakerType = SpeakerType.Other;

  public isSystemDependent(dependent: boolean): AudioFactory {
    this._systemDependent = dependent;
    return this;
  }

  // public withAudioDevices(devices: Map<DeviceType, Device[]>): AudioFactory {
  //     this._audioDevices = devices;
  //     return this;
  // }

  public withSpeakerType(type: SpeakerType): AudioFactory {
    this._speakerType = type;
    return this;
  }

  public build(): Audio {
    return {
      systemDependent: this._systemDependent,
      speakerType: this._speakerType,
      // audioDevices: this._audioDevices
    };
  }
}
