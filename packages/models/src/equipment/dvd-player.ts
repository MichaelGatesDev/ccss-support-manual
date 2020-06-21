import { Device } from "./device";

/**
 *
 */
export interface DVDPlayer extends Device {
  /**
   * The type of player (pc, player, etc.)
   */
  playerType: DVDPlayerType;
}

export enum DVDPlayerType {
  Computer = 0,
  DVD = 1 << 0,
  Bluray = 1 << 1,
  VCR = 1 << 2,
  Other,
}

export class DVDPlayerFactory {
  private _device: Device;

  private _type: DVDPlayerType = DVDPlayerType.Other;

  public constructor(device: Device) {
    this._device = device;
  }

  public ofType(DVDPlayerType: DVDPlayerType): DVDPlayerFactory {
    this._type = DVDPlayerType;
    return this;
  }

  public build(): DVDPlayer {
    return {
      ...this._device,
      playerType: this._type,
    };
  }
}
