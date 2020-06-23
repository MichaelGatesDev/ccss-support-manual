import { ConfigBase } from "cardboard-config";

export class AppConfig extends ConfigBase {
  public checkUpdates: boolean = true;
  public applyUpdates: boolean = true;
  public programReleaseURL: string = "https://api.github.com/repos/michaelgatesdev/ccss-support-manual/releases";
}
