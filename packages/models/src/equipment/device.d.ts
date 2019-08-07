export interface Device {
    make: string;
    model: string;
    deviceType: DeviceType;
}
export declare enum DeviceType {
    None = 0,
    DVDPlayer = 1,
    Computer = 2,
    Phone = 3,
    Printer = 4,
    Other = 5
}
export declare class DeviceFactory {
    private _make;
    private _model;
    private _type;
    withMake(make: string): DeviceFactory;
    withModel(model: string): DeviceFactory;
    ofType(deviceType: DeviceType): DeviceFactory;
    build(): Device;
}
