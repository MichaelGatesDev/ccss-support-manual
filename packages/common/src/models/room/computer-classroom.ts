import { LabComputer } from "../equipment/computer";
import { Printer } from "../equipment/printer";
import { Classroom } from "./classroom";

export interface ComputerClassroom extends Classroom {
    labComputers: LabComputer[];

    /**
     * 
     */
    printer?: Printer;
}