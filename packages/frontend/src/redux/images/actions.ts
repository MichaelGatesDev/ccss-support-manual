import {
  Image,
  RoomImage,
  BuildingImage,
} from "@ccss-support-manual/models";
import { ImageUtils } from "@ccss-support-manual/utilities";
import { Dispatch } from "redux";
import { FETCH_IMAGES, FETCH_BUILDING_IMAGES } from "./types";

export function fetchImages() {
  return (dispatch: Dispatch) => {
    fetch("/api/v1/images/")
      .then(response => response.json())
      .then((images: Image[]) => {

        const roomImages = images.filter((image): image is RoomImage => ImageUtils.isRoomImage(image));
        const buildingImages = images.filter((image): image is BuildingImage => ImageUtils.isBuildingImage(image));

        dispatch({
          type: FETCH_IMAGES,
          payload: {
            roomImages,
            buildingImages,
          },
        });
      }).catch(error => {
        console.error("Failed to fetch images");
        console.error(error);
      });
  };
}

export function fetchBuildingImages(buildingName: string) {
  return (dispatch: Dispatch) => {
    fetch(`/api/v1/images/buildings/${buildingName}`)
      .then(response => response.json())
      .then((images: BuildingImage[]) => {
        dispatch({
          type: FETCH_BUILDING_IMAGES,
          payload: {
            images,
          },
        });
      }).catch(error => {
        console.error(`Failed to fetch images for building ${buildingName}`);
        console.error(error);
      });
  };
}
