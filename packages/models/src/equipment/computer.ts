import { Device } from "./device";

export interface Computer extends Device {
  /**
   *  The physical structure of a computer
   */
  computerType: ComputerType;

  /**
   * The operating system run by the computer
   */
  operatingSystem: OperatingSystem;

  /**
   * If the computer is equipped with a webcam
   */
  hasInternalWebcam: boolean;
}

export type ComputerType = "tower" | "all-in-one" | "mini" | "other";
export type OperatingSystem = "linux" | "cloud-ready linux" | "windows 7" | "windows 10" | "osx" | "other";
