import fs from "fs";
import jimp from "jimp";
import path from "path";
import { Logger, ArrayUtils } from '@michaelgatesdev/common';
import { FileUtils } from "@michaelgatesdev/common-io";

import { BuildingImage, RoomImage, BuildingImageFactory, ImageFactory, ImageType, RoomImageFactory, Image } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";
import { app } from "./app";

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
        if (await this.createDirectoryIfNotExists(app.BUILDING_IMAGES_DIR)) {
            Logger.debug("Created 'buildings' image directory");
        }

        // load images
        Logger.info("Loading all images...");
        await this.loadImages();
        Logger.info("Finished loading images");

        // generate thumbnails
        Logger.info("Creating thumbnails...");
        await this.createThumbnails();
        Logger.info("Finished creating thumbnails");

        // let us know which images we're missing
        this.logMissing();
    }

    public async clear(): Promise<void> {
        this.buildingImages = [];
        this.roomImages = [];
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
            // building images
            const buildingDir = path.join(app.BUILDING_IMAGES_DIR, building.internalName);
            // create building dir if not exists
            await this.createDirectoryIfNotExists(buildingDir);
            const rootBuildingImages = await this.createBuildingImagesFromDirectory(buildingDir, building.internalName, ImageType.Building);
            this.buildingImages.push(...rootBuildingImages);

            // UNCOMMENT IF YOU WANT BUILDING PANORAMA IMAGES
            // // panorama images
            // const panoramasDir = `${buildingDir}/panoramas`;
            // // create titles dir if it doesnt exist
            // await this.createDirectoryIfNotExists(panoramasDir);
            // const panoramaBuildingImages = await this.createBuildingImagesFromDirectory(panoramasDir, building.internalName, ImageType.BuildingPanorama);
            // this.buildingImages.push(...panoramaBuildingImages);

            const roomsDir = path.join(buildingDir, "rooms");
            // create rooms dir if not exists
            await this.createDirectoryIfNotExists(roomsDir);

            for (const room of building.rooms) {

                const roomDir = path.join(roomsDir, `${room.number}`.toLocaleLowerCase());
                // create room dir if it doesnt exist
                await this.createDirectoryIfNotExists(roomDir);
                const rootImages = await this.createRoomImagesFromDirectory(roomDir, building.internalName, room.number.toString(), ImageType.Room);
                this.roomImages.push(...rootImages);

                // title images
                const titlesDir = path.join(roomDir, "titles");
                // create titles dir if it doesnt exist
                await this.createDirectoryIfNotExists(titlesDir);
                const titleImages = await this.createRoomImagesFromDirectory(titlesDir, building.internalName, room.number.toString(), ImageType.RoomTitle);
                this.roomImages.push(...titleImages);

                // panoramic images
                const panoramasDir = path.join(roomDir, "panoramas");
                // create panoramas dir if it doesnt exist
                await this.createDirectoryIfNotExists(panoramasDir);
                const panoramicImages = await this.createRoomImagesFromDirectory(panoramasDir, building.internalName, room.number.toString(), ImageType.RoomPanorama);
                this.roomImages.push(...panoramicImages);

                // equipment images
                const equipmentDir = path.join(roomDir, "equipment");
                // create equipment dir if it doesnt exist
                await this.createDirectoryIfNotExists(equipmentDir);
                const equipmentImages = await this.createRoomImagesFromDirectory(equipmentDir, building.internalName, room.number.toString(), ImageType.RoomEquipment);
                this.roomImages.push(...equipmentImages);
            }
        }
    }

    private async createBuildingImagesFromDirectory(dir: string, buildingName: string, type: ImageType): Promise<BuildingImage[]> {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });
        const imagesPromise = files.map(async (file) => {
            if (file.isDirectory()) return undefined;
            if (file.name.endsWith(".thumb.jpg")) return undefined;

            const fileName = file.name;
            const filePath = path.join(dir, fileName);

            const newPath = filePath.replace(`${app.PUBLIC_DIR}${path.sep}`, "");
            const image = new BuildingImageFactory(
                new ImageFactory()
                    .ofType(type)
                    .withPath(newPath.replace(new RegExp(path.sep, 'g'), "/"))
                    .withActualPath(filePath)
                    .withThumb({ fileName, path: `${newPath}.thumb.jpg` })
                    .build()
            )
                .withBuildingName(buildingName)
                .build();
            return image;
        });
        return (await Promise.all(imagesPromise)).filter((image: BuildingImage | undefined): image is BuildingImage => image !== undefined);
    }


    private async createRoomImagesFromDirectory(dir: string, buildingName: string, roomNumber: string, type: ImageType): Promise<RoomImage[]> {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });
        const imagesPromise = files.map(async (file) => {
            if (file.isDirectory()) return undefined;
            if (file.name.endsWith(".thumb.jpg")) return undefined;

            const fileName = file.name;
            const filePath = path.join(dir, fileName);

            const newPath = filePath.replace(`${app.PUBLIC_DIR}${path.sep}`, "");
            const image = new RoomImageFactory(
                new ImageFactory()
                    .ofType(type)
                    .withPath(newPath.replace(new RegExp(path.sep, 'g'), "/"))
                    .withActualPath(filePath)
                    .withThumb({ fileName, path: `${newPath}.thumb.jpg` })
                    .build()
            )
                .withBuildingName(buildingName)
                .withRoomNumber(roomNumber)
                .build();
            return image;
        });
        return (await Promise.all(imagesPromise)).filter((image: RoomImage | undefined): image is RoomImage => image !== undefined);
    }


    private async createDirectoryIfNotExists(path: string): Promise<boolean> {
        if (!await FileUtils.checkExists(path)) {
            if (await FileUtils.createDirectory(path)) {
                return true;
            }
        }
        return false;
    }

    private async createThumbnails(): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const image of this.getAllImages()) {
            if (this.isThumbnail(image.path) || await this.hasThumbnail(image.actualPath)) continue; // don't create thumbnails for thumbnails
            const thumbnailWidth = app.configManager.imagesConfig !== undefined ? app.configManager.imagesConfig.buildingImageThumbnailWidth : 350;
            const promise = this.createThumbnail(path.join(app.PUBLIC_DIR, image.path), path.join(app.PUBLIC_DIR, image.thumbnail.path), thumbnailWidth);
            promises.push(promise);
        }
        await Promise.all(promises);
    }

    public async createThumbnail(path: string, dest: string, width: number, height?: number): Promise<void> {
        try {
            Logger.debug(`Creating thumbnail for ${path} (width: ${width})...`);
            const img = await jimp.read(path);
            img.resize(width, jimp.AUTO).quality(100);
            await img.writeAsync(dest);
            // Logger.info(`Created thumbnail for ${path} (width: ${width})`);
        } catch (error) {
            Logger.error(`Error while generating thumbnail for ${path}`);
            Logger.error(error);
        }
    }

    private isThumbnail(name: string): boolean {
        return name.toLowerCase().includes(".thumb.jpg");
    }

    private async hasThumbnail(path: string): Promise<boolean> {
        return await FileUtils.checkExists(`${path}.thumb.jpg`);
    }

    public getImagesForBuilding(buildingName: string): BuildingImage[] {
        const building = app.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return [];
        return this.buildingImages.filter((image: BuildingImage) => BuildingUtils.hasName(building, image.buildingName));
    }

    public getImagesForRoom(buildingName: string, roomNumber: string): RoomImage[] {
        const building = app.buildingManager.getBuildingByName(buildingName);
        if (building === undefined) return [];
        return this.roomImages.filter((image: RoomImage) => BuildingUtils.hasName(building, image.buildingName) && image.roomNumber === roomNumber);
    }

    public getAllImages(): Image[] {
        return [
            ...this.buildingImages,
            ...this.roomImages,
        ];
    }

}
