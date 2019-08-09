import { BuildingImage, RoomImage, BuildingImageFactory, ImageFactory, ImageType, RoomImageFactory, Image } from "@ccss-support-manual/models";
import { FileUtils, Logger, LogLevel } from "@ccss-support-manual/utilities";
import { app } from "./app";
import fs from "fs";

/**
 * A utility class for managing images
 */
export class ImageManager {
    public buildingImages: BuildingImage[];
    public roomImages: RoomImage[];

    public constructor() {
        this.buildingImages = [];
        this.roomImages = [];
    }

    public async initialize(): Promise<void> {
        await this.loadImages();
    }

    public async loadImages(): Promise<void> {

        // create buildings dir if it does not exist
        if (!await FileUtils.checkExists(app.BUILDING_IMAGES_DIR)) {
            await FileUtils.createDirectory(app.BUILDING_IMAGES_DIR);
            Logger.log(LogLevel.Info, `Created directory:  ${app.BUILDING_IMAGES_DIR}`);
        }

        for (const building of app.buildingManager.buildings) {

            const buildingDir = `${app.BUILDING_IMAGES_DIR}/${building.internalName}`;
            // create building dir if not exists
            if (!await FileUtils.checkExists(buildingDir)) {
                await FileUtils.createDirectory(buildingDir);
                Logger.log(LogLevel.Info, `Created directory:  ${buildingDir}`);
            }

            // building images
            let buildingFiles = await fs.promises.readdir(buildingDir, { withFileTypes: true });
            for (const file of buildingFiles) {
                if (file.isDirectory()) continue;
                const newPath = `${buildingDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                const image = new BuildingImageFactory(
                    new ImageFactory().ofType(ImageType.Building).withPath(newPath).build()
                ).withBuildingName(building.internalName).build();
                this.buildingImages.push(image);
            }


            const roomsDir = `${buildingDir}/rooms/`;
            // create rooms dir if not exists
            if (!await FileUtils.checkExists(roomsDir)) {
                if (await FileUtils.createDirectory(roomsDir)) {
                    Logger.log(LogLevel.Info, `Created directory:  ${roomsDir}`);
                }
            }

            for (const room of building.rooms) {

                const roomDir = `${roomsDir}/${room.number.toLocaleLowerCase()}`;
                // create room dir if it doesnt exist
                if (!await FileUtils.checkExists(roomDir)) {
                    if (await FileUtils.createDirectory(roomDir)) {
                        Logger.log(LogLevel.Info, `Created directory:  ${roomDir}`);
                    }
                }

                // root images
                let rootFiles = await fs.promises.readdir(roomDir, { withFileTypes: true });
                for (const file of rootFiles) {
                    if (file.isDirectory()) continue;
                    const newPath = `${roomDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                    const image = new RoomImageFactory(
                        new BuildingImageFactory(
                            new ImageFactory().ofType(ImageType.Room).withPath(newPath).build()
                        ).withBuildingName(building.internalName).build()
                    ).build();
                    this.roomImages.push(image);
                }


                // panoramic images
                const panoramasDir = roomDir + "panoramas/";
                // create panoramas dir if it doesnt exist
                if (!await FileUtils.checkExists(panoramasDir)) {
                    if (await FileUtils.createDirectory(panoramasDir)) {
                        Logger.log(LogLevel.Info, `Created directory:  ${panoramasDir}`);
                    }
                }
                const panoramaFiles = await fs.promises.readdir(panoramasDir, { withFileTypes: true });
                for (const file of panoramaFiles) {
                    if (file.isDirectory) continue;
                    const newPath = `${roomDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                    const image = new RoomImageFactory(
                        new BuildingImageFactory(
                            new ImageFactory().ofType(ImageType.RoomPanorama).withPath(newPath).build()
                        ).withBuildingName(building.internalName).build()
                    ).build();
                    this.roomImages.push(image);
                }


                // equipment images
                let equipmentDir = roomDir + "equipment/";
                // create equipment dir if it doesnt exist
                if (!await FileUtils.checkExists(equipmentDir)) {
                    if (await FileUtils.createDirectory(equipmentDir)) {
                        Logger.log(LogLevel.Info, `Created directory:  ${equipmentDir}`);
                    }
                }

                const equipmentFiles = await fs.promises.readdir(equipmentDir, { withFileTypes: true });
                for (const file of equipmentFiles) {
                    if (file.isDirectory) continue;
                    const newPath = `${roomDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                    const image = new RoomImageFactory(
                        new BuildingImageFactory(
                            new ImageFactory().ofType(ImageType.RoomEquipment).withPath(newPath).build()
                        ).withBuildingName(building.internalName).build()
                    ).build();
                    this.roomImages.push(image);
                }
            }
        }
    }


    public getImagesForBuilding(buildingName: string): BuildingImage[] {
        let result: BuildingImage[] = [];
        this.buildingImages.forEach((buildingImage): void => {
            if (buildingImage.buildingName === buildingName) {
                result.push(buildingImage);
            }
        });
        return result;
    }

    public getImagesForRoom(buildingName: string, roomNumber: string): RoomImage[] {
        let result: RoomImage[] = [];
        this.roomImages.forEach((roomImage): void => {
            if (roomImage.buildingName === buildingName && roomImage.roomNumber === roomNumber) {
                result.push(roomImage);
            }
        });
        return result;
    }

    public getAllImages(): Image[] {
        return this.buildingImages.concat(this.roomImages);
    }

}
