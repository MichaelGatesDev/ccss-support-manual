import { Printer } from "../equipment/printer";
import { SmartClassroom } from "./smart-classroom";

export interface ComputerClassroom extends SmartClassroom {
    // labComputers: LabComputer[];

    /**
     * 
     */
    printer?: Printer;
}