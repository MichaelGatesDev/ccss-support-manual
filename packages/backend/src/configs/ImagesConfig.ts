import { ConfigBase } from "cardboard-config";

export class ImagesConfig extends ConfigBase {
    public checkForImageUpdates: boolean = true;

    public buildingImageThumbnailWidth: number = 350;
    public roomImageThumbnailWidth: number = 350;
}