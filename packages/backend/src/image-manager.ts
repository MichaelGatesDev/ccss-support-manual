import { Logger, ArrayUtils } from '@michaelgatesdev/common';
import { FileUtils } from "@michaelgatesdev/common-io";

import fs from "fs";
import sharp from "sharp";
import { app } from "./app";
import { BuildingImage, RoomImage, BuildingImageFactory, ImageFactory, ImageType, RoomImageFactory, Image } from "@ccss-support-manual/models";
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

            // building images
            const buildingDir = `${app.BUILDING_IMAGES_DIR}/${building.internalName}`;
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

            const roomsDir = `${buildingDir}/rooms`;
            // create rooms dir if not exists
            await this.createDirectoryIfNotExists(roomsDir);

            for (const room of building.rooms) {

                const roomDir = `${roomsDir}/${`${room.number}`.toLocaleLowerCase()}`;
                // create room dir if it doesnt exist
                await this.createDirectoryIfNotExists(roomDir);
                const rootImages = await this.createRoomImagesFromDirectory(roomDir, building.internalName, room.number.toString(), ImageType.Room);
                this.roomImages.push(...rootImages);

                // title images
                const titlesDir = `${roomDir}/titles`;
                // create titles dir if it doesnt exist
                await this.createDirectoryIfNotExists(titlesDir);
                const titleImages = await this.createRoomImagesFromDirectory(titlesDir, building.internalName, room.number.toString(), ImageType.RoomTitle);
                this.roomImages.push(...titleImages);

                // panoramic images
                const panoramasDir = `${roomDir}/panoramas`;
                // create panoramas dir if it doesnt exist
                await this.createDirectoryIfNotExists(panoramasDir);
                const panoramicImages = await this.createRoomImagesFromDirectory(titlesDir, building.internalName, room.number.toString(), ImageType.RoomPanorama);
                this.roomImages.push(...panoramicImages);

                // equipment images
                const equipmentDir = `${roomDir}/equipment`;
                // create equipment dir if it doesnt exist
                await this.createDirectoryIfNotExists(equipmentDir);
                const equipmentImages = await this.createRoomImagesFromDirectory(titlesDir, building.internalName, room.number.toString(), ImageType.RoomEquipment);
                this.roomImages.push(...equipmentImages);
            }
        }
    }

    private async createBuildingImagesFromDirectory(dir: string, buildingName: string, type: ImageType): Promise<BuildingImage[]> {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });
        const imagesPromise = files.map(async (file) => {
            if (file.isDirectory()) return undefined;

            await this.createThumbnailIfNotExists(`${dir}/${file.name}`, 350, false);

            const newPath = `${dir}/${file.name}.thumb.jpg`.replace(`${app.PUBLIC_DIR}/`, "");
            const image = new BuildingImageFactory(
                new ImageFactory()
                    .ofType(type)
                    .withPath(newPath)
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

            await this.createThumbnailIfNotExists(`${dir}/${file.name}`, 350, false);

            const newPath = `${dir}/${file.name}.thumb.jpg`.replace(`${app.PUBLIC_DIR}/`, "");
            const image = new RoomImageFactory(
                new ImageFactory()
                    .ofType(type)
                    .withPath(newPath)
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

    public async createThumbnail(path: string, dest: string, width: number, height?: number): Promise<void> {
        try {
            await sharp(path)
                .resize(width, height)
                .jpeg({ quality: 100 })
                .toFile(dest);
        } catch (e) {
            throw e;
        }
    }

    private async createThumbnailIfNotExists(path: string, width: number, forceCreate?: boolean): Promise<void> {
        if (!this.isThumb(path) && (!await this.hasThumb(`${path}`) || forceCreate)) {
            Logger.warning(`No thumbnail exists for ${path}`);
            try {
                await this.createThumbnail(`${path}`, `${path}.thumb.jpg`, width);
                Logger.info(`Created thumbnail for ${path} (width: ${width})`);
            } catch (error) {
                Logger.error(`Error while generating thumbnail for ${path}`);
                Logger.error(error);
            }
        }
    }

    private isThumb(name: string): boolean {
        return name.toLowerCase().endsWith(".thumb.jpg");
    }

    private async hasThumb(name: string): Promise<boolean> {
        return await FileUtils.checkExists(`${name}.thumb.jpg`);
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
