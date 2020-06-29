import fs from "fs";
import jimp from "jimp";
import path from "path";
import { FileUtils } from "@michaelgatesdev/common-io";

import { BuildingImage, RoomImage, BuildingImageFactory, ImageFactory, ImageType, RoomImageFactory, Image } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { App, logger } from "./app";

/**
 * A utility class for managing images
 */
export class ImageManager {
  private readonly app: App;

  public buildingImages: BuildingImage[];
  public roomImages: RoomImage[];

  constructor(app: App) {
    this.app = app;
    this.buildingImages = [];
    this.roomImages = [];
  }

  public async initialize(): Promise<void> {
    // create buildings dir if it does not exist
    await this.app.createDirectory(this.app.BUILDING_IMAGES_DIR);

    // load images
    logger.info("Loading all images...");
    await this.loadImages();
    logger.info("Finished loading images");

    // generate thumbnails
    logger.info("Creating thumbnails...");
    await this.createThumbnails();
    logger.info("Finished creating thumbnails");

    // let us know which images we're missing
    this.logMissing();
  }

  public async clear(): Promise<void> {
    this.buildingImages = [];
    this.roomImages = [];
  }

  private logMissing(): void {
    for (const building of this.app.buildingManager.buildings) {
      const buildingImages = this.getImagesForBuilding(building.name);
      if (buildingImages.length === 0) {
        logger.warn(`Missing building images for: ${building.name}`);
      }
      for (const room of building.rooms) {
        const roomImages = this.getImagesForRoom(room.building.name, `${room.number}`);
        if (roomImages.length === 0) {
          logger.warn(`Missing room images for: ${room.building.name} ${room.number}`);
        }
      }
    }
  }

  public async loadImages(): Promise<void> {
    for (const building of this.app.buildingManager.buildings) {
      // building images
      const buildingDir = path.join(this.app.BUILDING_IMAGES_DIR, building.name);
      // create building dir if not exists
      await this.app.createDirectory(buildingDir);
      const rootBuildingImages = await this.createBuildingImagesFromDirectory(buildingDir, building.name, ImageType.Building);
      this.buildingImages.push(...rootBuildingImages);

      // UNCOMMENT IF YOU WANT BUILDING PANORAMA IMAGES
      // // panorama images
      // const panoramasDir = `${buildingDir}/panoramas`;
      // // create titles dir if it doesnt exist
      // await app.createDirectory(panoramasDir);
      // const panoramaBuildingImages = await this.createBuildingImagesFromDirectory(panoramasDir, building.name, ImageType.BuildingPanorama);
      // this.buildingImages.push(...panoramaBuildingImages);

      const roomsDir = path.join(buildingDir, "rooms");
      // create rooms dir if not exists
      await this.app.createDirectory(roomsDir);

      for (const room of building.rooms) {
        const roomDir = path.join(roomsDir, `${room.number}`.toLocaleLowerCase());
        // create room dir if it doesnt exist
        await this.app.createDirectory(roomDir);
        const rootImages = await this.createRoomImagesFromDirectory(roomDir, building.name, room.number.toString(), ImageType.Room);
        this.roomImages.push(...rootImages);

        // title images
        const titlesDir = path.join(roomDir, "titles");
        // create titles dir if it doesnt exist
        await this.app.createDirectory(titlesDir);
        const titleImages = await this.createRoomImagesFromDirectory(titlesDir, building.name, room.number.toString(), ImageType.RoomTitle);
        this.roomImages.push(...titleImages);

        // panoramic images
        const panoramasDir = path.join(roomDir, "panoramas");
        // create panoramas dir if it doesnt exist
        await this.app.createDirectory(panoramasDir);
        const panoramicImages = await this.createRoomImagesFromDirectory(panoramasDir, building.name, room.number.toString(), ImageType.RoomPanorama);
        this.roomImages.push(...panoramicImages);

        // equipment images
        const equipmentDir = path.join(roomDir, "equipment");
        // create equipment dir if it doesnt exist
        await this.app.createDirectory(equipmentDir);
        const equipmentImages = await this.createRoomImagesFromDirectory(equipmentDir, building.name, room.number.toString(), ImageType.RoomEquipment);
        this.roomImages.push(...equipmentImages);
      }
    }
  }

  private async createBuildingImagesFromDirectory(dir: string, buildingName: string, type: ImageType): Promise<BuildingImage[]> {
    const files = await fs.promises.readdir(dir, {
      withFileTypes: true,
    });
    const imagesPromise = files.map(async file => {
      if (file.isDirectory()) return undefined;
      if (file.name.endsWith(".thumb.jpg")) return undefined;

      const fileName = file.name;
      const filePath = path.join(dir, fileName);

      const newPath = filePath.replace(`${this.app.APP_DATA_DIR}${path.sep}`, "").replace(new RegExp("\\\\", "g"), "/");
      const image = new BuildingImageFactory(
        new ImageFactory()
          .ofType(type)
          .withPath(newPath)
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
    const files = await fs.promises.readdir(dir, {
      withFileTypes: true,
    });
    const imagesPromise = files.map(async file => {
      if (file.isDirectory()) return undefined;
      if (file.name.endsWith(".thumb.jpg")) return undefined;

      const fileName = file.name;
      const filePath = path.join(dir, fileName);

      const newPath = filePath.replace(`${this.app.APP_DATA_DIR}${path.sep}`, "").replace(new RegExp("\\\\", "g"), "/");
      const image = new RoomImageFactory(
        new ImageFactory()
          .ofType(type)
          .withPath(newPath)
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

  private async createThumbnails(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const image of this.getAllImages()) {
      if (this.isThumbnail(image.path) || (await this.hasThumbnail(image.actualPath))) continue; // don't create thumbnails for thumbnails
      const thumbnailWidth = this.app.configManager.imagesConfig !== undefined ? this.app.configManager.imagesConfig.buildingImageThumbnailWidth : 350;
      const promise = this.createThumbnail(path.join(this.app.APP_DATA_DIR, image.path), path.join(this.app.APP_DATA_DIR, image.thumbnail.path), thumbnailWidth);
      promises.push(promise);
    }
    await Promise.all(promises);
  }

  public async createThumbnail(path: string, dest: string, width: number): Promise<void> {
    try {
      logger.debug(`Creating thumbnail for ${path} (width: ${width})...`);
      const img = await jimp.read(path);
      img.resize(width, jimp.AUTO).quality(100);
      await img.writeAsync(dest);
      // logger.info(`Created thumbnail for ${path} (width: ${width})`);
    } catch (error) {
      logger.error(`Error while generating thumbnail for ${path}`);
      logger.error(error);
    }
  }

  private isThumbnail(name: string): boolean {
    return name.toLowerCase().includes(".thumb.jpg");
  }

  private async hasThumbnail(path: string): Promise<boolean> {
    return await FileUtils.checkExists(`${path}.thumb.jpg`);
  }

  public getImagesForBuilding(buildingName: string): BuildingImage[] {
    const building = this.app.buildingManager.getBuildingByName(buildingName);
    if (building === undefined) return [];
    return this.buildingImages.filter((image: BuildingImage) => BuildingUtils.hasName(building, image.buildingName));
  }

  public getImagesForRoom(buildingName: string, roomNumber: string): RoomImage[] {
    const building = this.app.buildingManager.getBuildingByName(buildingName);
    if (building === undefined) return [];
    return this.roomImages.filter((image: RoomImage) => BuildingUtils.hasName(building, image.buildingName) && image.roomNumber === roomNumber);
  }

  public getAllImages(): Image[] {
    return [...this.buildingImages, ...this.roomImages];
  }
}
