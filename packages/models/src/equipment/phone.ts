import { Device } from "./device";

/**
 * A Phone (like cellphone but older)
 */
export interface Phone extends Device {
  /**
   * The last 4 digits of the phone number
   */
  extension: string;

  /**
   * If the phone has a display
   */
  hasDisplay: boolean;

  /**
   * If the phone has a speaker
   */
  hasSpeaker: boolean;
}

export class PhoneFactory {
  private _device: Device;

  private _extension = "0000";
  private _hasDisplay = false;
  private _hasSpeaker = false;

  public constructor(device: Device) {
    this._device = device;
  }

  public withExtension(extension: string): PhoneFactory {
    this._extension = extension;
    return this;
  }

  public hasDisplay(has: boolean): PhoneFactory {
    this._hasDisplay = has;
    return this;
  }

  public hasSpeaker(has: boolean): PhoneFactory {
    this._hasSpeaker = has;
    return this;
  }

  public build(): Phone {
    return {
      ...this._device,
      extension: this._extension,
      hasDisplay: this._hasDisplay,
      hasSpeaker: this._hasSpeaker,
    };
  }
}
