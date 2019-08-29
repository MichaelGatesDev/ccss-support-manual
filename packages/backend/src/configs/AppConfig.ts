import { ConfigBase } from "cardboard-config";

export class AppConfig extends ConfigBase {
    public checkForProgramUpdates: boolean = true;
    public checkForDataUpdates: boolean = true;
}