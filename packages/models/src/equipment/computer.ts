import { Device } from "./device";

/**
 * A Computer
 */
export interface Computer extends Device {
  /**
   *  The physical structure of a computer
   */
  computerType: ComputerType;

  /**
   * The operating system run by the computer
   */
  operatingSystem: OperatingSystem;
}

/**
 * The primary computer in the room.
 * It is usually the computer which will be projected or will have audio streamed from it to an external sound source.
 */
export interface TeachingStationComputer extends Computer {
  hasWebcam: boolean;
}

/**
 *
 */
export interface LabComputer extends Computer {
  id: string;
}

export enum ComputerType {
  Tower,
  AllInOne,
  Mini,
  Other,
}

export enum OperatingSystem {
  Linux,
  CloudReadyLinux,
  Windows7,
  Windows10,
  OSX,
  Other,
}

export class ComputerFactory {
  private _device: Device;

  private _type: ComputerType = ComputerType.Other;
  private _operatingSystem: OperatingSystem = OperatingSystem.Other;

  public constructor(device: Device) {
    this._device = device;
  }

  public ofType(computerType: ComputerType): ComputerFactory {
    this._type = computerType;
    return this;
  }

  public withOperatingSystem(os: OperatingSystem): ComputerFactory {
    this._operatingSystem = os;
    return this;
  }

  public build(): Computer {
    return {
      ...this._device,
      computerType: this._type,
      operatingSystem: this._operatingSystem,
    };
  }
}

export class TeachingStationComputerFactory {
  private _computer: Computer;

  private _hasWebcam = false;

  public constructor(computer: Computer) {
    this._computer = computer;
  }

  public hasWebcam(has: boolean): TeachingStationComputerFactory {
    this._hasWebcam = has;
    return this;
  }

  public build(): TeachingStationComputer {
    return {
      ...this._computer,
      hasWebcam: this._hasWebcam,
    };
  }
}

export class LabComputerFactory {
  private _computer: Computer;

  private _id = "";

  public constructor(computer: Computer) {
    this._computer = computer;
  }

  public withID(id: string): LabComputerFactory {
    this._id = id;
    return this;
  }

  public build(): LabComputer {
    return {
      ...this._computer,
      id: this._id,
    };
  }
}
