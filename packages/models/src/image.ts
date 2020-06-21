export interface Image {
  path: string;
  actualPath: string;
  type: ImageType;

  thumbnail: ThumbnailImage;
}

export interface ThumbnailImage {
  path: string;
  fileName: string;
}

export interface BuildingImage extends Image {
  buildingName: string;
}

export interface RoomImage extends Image {
  buildingName: string;
  roomNumber: string;
}

export enum ImageType {
  Building,
  BuildingPanorama,
  Room,
  RoomPanorama,
  RoomEquipment,
  RoomTitle,
  Other,
}

export class ImageFactory {
  private _path: string = "";
  private _actualPath: string = "";
  private _type: ImageType = ImageType.Other;
  private _thumb: ThumbnailImage = { fileName: "", path: "" };

  public withPath(path: string): ImageFactory {
    this._path = path;
    return this;
  }

  public withActualPath(path: string): ImageFactory {
    this._actualPath = path;
    return this;
  }

  public ofType(type: ImageType): ImageFactory {
    this._type = type;
    return this;
  }

  public withThumb(thumb: ThumbnailImage): ImageFactory {
    this._thumb = thumb;
    return this;
  }

  public build(): Image {
    return {
      path: this._path,
      actualPath: this._actualPath,
      type: this._type,
      thumbnail: this._thumb,
    };
  }
}

export class BuildingImageFactory {
  private _image: Image;
  private _buildingName: string = "";

  public constructor(image: Image) {
    this._image = image;
  }

  public withBuildingName(buildingName: string): BuildingImageFactory {
    this._buildingName = buildingName;
    return this;
  }

  public build(): BuildingImage {
    return {
      ...this._image,
      buildingName: this._buildingName,
    };
  }
}

export class RoomImageFactory {
  private _image: Image;
  private _buildingName: string = "";
  private _roomNumber: string = "";

  public constructor(image: Image) {
    this._image = image;
  }

  public withBuildingName(buildingName: string): RoomImageFactory {
    this._buildingName = buildingName;
    return this;
  }

  public withRoomNumber(roomNumber: string): RoomImageFactory {
    this._roomNumber = roomNumber;
    return this;
  }

  public build(): RoomImage {
    return {
      ...this._image,
      buildingName: this._buildingName,
      roomNumber: this._roomNumber,
    };
  }
}
