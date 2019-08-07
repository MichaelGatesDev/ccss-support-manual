import { Device } from "./device";

/**
 * A printer
 */
export interface Printer extends Device {
    /**
     * The identifying Symquest number if there is one
     */
    symquestNumber: string;

    /**
     * The type of (toner) cartridge used
     */
    cartridgeType: string;
}


export class PrinterFactory {

    private _device: Device;

    private _symquestNumber: string = "";
    private _cartridgeType: string = "";

    public constructor(device: Device) {
        this._device = device;
    }

    public withSymquestNumber(number: string): PrinterFactory {
        this._symquestNumber = number;
        return this;
    }

    public withCartridgeType(type: string): PrinterFactory {
        this._cartridgeType = type;
        return this;
    }


    public build(): Printer {
        return {
            ...this._device,
            symquestNumber: this._symquestNumber,
            cartridgeType: this._cartridgeType
        };
    }
}