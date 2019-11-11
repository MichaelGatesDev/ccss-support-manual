import { ConfigBase } from "cardboard-config";

export class AppConfig extends ConfigBase {
    public checkForProgramUpdates: boolean = true;
    public programReleaseURL: string = "https://api.github.com/repos/michaelgatesdev/ccss-support-manual/releases";
    public currentVersion: string = "1.3.8";
}