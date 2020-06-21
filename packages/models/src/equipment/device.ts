export interface Device {
  make: string;
  model: string;
  deviceType: DeviceType;
}

export enum DeviceType {
  None = 0,
  // AudioInput = 1 << 0,
  // AudioOutput = 1 << 1,
  // AudioProjection = 1 << 2,
  // VideoInput = 1 << 3,
  // VideoOutput = 1 << 4,
  // VideoProjection = 1 << 5,
  DVDPlayer,
  Computer,
  Phone,
  Printer,
  Other,
}

export class DeviceFactory {
  private _make = "";
  private _model = "";
  private _type: DeviceType = DeviceType.Other;

  public withMake(make: string): DeviceFactory {
    this._make = make;
    return this;
  }

  public withModel(model: string): DeviceFactory {
    this._model = model;
    return this;
  }

  public ofType(deviceType: DeviceType): DeviceFactory {
    this._type = deviceType;
    return this;
  }

  public build(): Device {
    return {
      make: this._make,
      model: this._model,
      deviceType: this._type,
    };
  }
}
