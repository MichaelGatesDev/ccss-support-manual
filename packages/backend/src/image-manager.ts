import { Logger, ArrayUtils } from '@michaelgatesdev/common';
import { FileUtils } from "@michaelgatesdev/common-io";

import { BuildingImage, RoomImage, BuildingImageFactory, ImageFactory, ImageType, RoomImageFactory, Image } from "@ccss-support-manual/models";
import { app } from "./app";
import fs from "fs";
import { BuildingUtils } from "@ccss-support-manual/utilities";

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
        // create buildings dir if it does not exist
        await this.createDirectoryIfNotExists(app.BUILDING_IMAGES_DIR);

        await this.loadImages();

        // let us know which images we're missing
        this.logMissing();
    }

    private logMissing() {
        for (const building of app.buildingManager.buildings) {
            const buildingImages = this.getImagesForBuilding(building.internalName);
            if (buildingImages.length === 0) {
                Logger.warning(`Missing building images for: ${building.internalName}`);
            }
            for (const room of building.rooms) {
                const roomImages = this.getImagesForRoom(room.buildingName, `${room.number}`);
                if (roomImages.length === 0) {
                    Logger.warning(`Missing room images for: ${room.buildingName} ${room.number}`);
                }
            }
        }
    }

    public async loadImages(): Promise<void> {

        for (const building of app.buildingManager.buildings) {

            const buildingDir = `${app.BUILDING_IMAGES_DIR}/${building.internalName}`;
            // create building dir if not exists
            await this.createDirectoryIfNotExists(buildingDir);

            // building images
            const buildingFiles = await fs.promises.readdir(buildingDir, { withFileTypes: true });
            for (const file of buildingFiles) {
                if (file.isDirectory()) continue;
                const newPath = `${buildingDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                const image = new BuildingImageFactory(
                    new ImageFactory()
                        .ofType(ImageType.Building)
                        .withPath(newPath)
                        .build()
                ).withBuildingName(building.internalName).build();
                this.buildingImages.push(image);
            }


            const roomsDir = `${buildingDir}/rooms`;
            // create rooms dir if not exists
            await this.createDirectoryIfNotExists(roomsDir);

            for (const room of building.rooms) {

                const roomDir = `${roomsDir}/${`${room.number}`.toLocaleLowerCase()}`;
                // create room dir if it doesnt exist
                await this.createDirectoryIfNotExists(roomDir);

                // root images
                const rootFiles = await fs.promises.readdir(roomDir, { withFileTypes: true });
                for (const file of rootFiles) {
                    if (file.isDirectory()) continue;
                    const newPath = `${roomDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                    const image = new RoomImageFactory(
                        new ImageFactory()
                            .ofType(ImageType.Room)
                            .withPath(newPath)
                            .build()
                    )
                        .withBuildingName(building.internalName)
                        .withRoomNumber(`${room.number}`)
                        .build();
                    this.roomImages.push(image);
                }

                // panoramic images
                const panoramasDir = roomDir + "/panoramas";
                // create panoramas dir if it doesnt exist
                await this.createDirectoryIfNotExists(panoramasDir);

                const panoramaFiles = await fs.promises.readdir(panoramasDir, { withFileTypes: true });
                for (const file of panoramaFiles) {
                    if (file.isDirectory) continue;
                    const newPath = `${roomDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                    const image = new RoomImageFactory(
                        new BuildingImageFactory(
                            new ImageFactory()
                                .ofType(ImageType.RoomPanorama)
                                .withPath(newPath)
                                .build()
                        ).withBuildingName(building.internalName).build()
                    ).build();
                    this.roomImages.push(image);
                }


                // equipment images
                const equipmentDir = roomDir + "/equipment";
                // create equipment dir if it doesnt exist
                await this.createDirectoryIfNotExists(equipmentDir);

                const equipmentFiles = await fs.promises.readdir(equipmentDir, { withFileTypes: true });
                for (const file of equipmentFiles) {
                    if (file.isDirectory) continue;
                    const newPath = `${roomDir}/${file.name}`.replace(`${app.PUBLIC_DIR}/`, "");
                    const image = new RoomImageFactory(
                        new BuildingImageFactory(
                            new ImageFactory()
                                .ofType(ImageType.RoomEquipment)
                                .withPath(newPath)
                                .build()
                        ).withBuildingName(building.internalName).build()
                    ).build();
                    this.roomImages.push(image);
                }
            }
        }
    }


    private async createDirectoryIfNotExists(path: string): Promise<boolean> {
        if (!await FileUtils.checkExists(path)) {
            if (await FileUtils.createDirectory(path)) {
                return true;
            }
        }
        return false;
    }


    public getImagesForBuilding(buildingName: string): BuildingImage[] {
        const building = app.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return [];
        return this.buildingImages.filter((image: BuildingImage) => BuildingUtils.hasName(building, image.buildingName));
    }


    public getImagesForRoom(buildingName: string, roomNumber: string): RoomImage[] {
        return this.roomImages.filter((image: RoomImage) => {
            const building = app.buildingManager.getBuildingByName(buildingName);
            if (building === undefined) return false;
            return BuildingUtils.hasName(building, image.buildingName) && image.roomNumber === roomNumber;
        });
    }


    public getAllImages(): Image[] {
        return [
            ...this.buildingImages,
            ...this.roomImages,
        ];
    }

}
