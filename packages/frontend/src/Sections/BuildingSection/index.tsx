import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import { ImageType, Building } from "@ccss-support-manual/models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuildings, updateBuilding, removeBuilding } from "../../redux/buildings/actions";
import { fetchBuildingImages, fetchRoomImagesForBuilding } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import ImageCarousel from "../../Components/ImageCarousel";
import Button, { ButtonType } from "../../Components/Button";
import { showEditPrompt, showConfirmPrompt } from "../../utils/WindowUtils";
import { FloatingGroup, FloatingGroupOrientation } from "../../Components/FloatingGroup";
import { RoomCardsDeck } from "../../Components/RoomCardsDeck";
import { SuccessPayload, FailurePayload } from "../../redux/payloads";

interface Props {
  match?: any;

  buildingName: string;

  buildingsState: BuildingsState;
  fetchBuildings: (options?: Partial<Building>) => Promise<SuccessPayload<Building[]> | FailurePayload>;
  updateBuilding: (building: Building, newProps: Building) => Promise<void>;
  removeBuilding: (buildingName: string) => void;

  imagesState: ImagesState;

  fetchBuildingImages: (buildingName: string) => void;
  fetchRoomImagesForBuilding: (buildingName: string) => void;
}

const BuildingSection = (props: Props) => {
  const {
    buildingsState,
    imagesState,

    buildingName,

    fetchBuildings,
    updateBuilding,
    removeBuilding,

    fetchBuildingImages,
    fetchRoomImagesForBuilding,
  } = props;

  useEffect(() => {
    fetchBuildings({ internalName: buildingName });
    fetchBuildingImages(buildingName);
    fetchRoomImagesForBuilding(buildingName);
  }, []);

  const buildings = buildingsState.fetchedBuildings;
  if (buildings == null || buildings.length == 0) {
    return <p>Loading buildings...</p>;
  }
  const building = buildings[0];

  const isLoading = (): boolean => buildingsState.fetchingBuildings || imagesState.imagesLoading;

  // if loading
  if (isLoading()) {
    // display splash
    return <LoadingSplash />;
  }

  let rooms = _.sortBy(building.rooms, ["number"]);

  const roomsImages = imagesState.roomImages.filter(image => image.type === ImageType.Room);

  return (
    <>
      {/* Main content */}
      <section className="container" id="building-section">
        {/* Meta */}
        <div className="row">
          {/* Photos */}
          <div className="col-12 col-lg-5 mb-4">
            <ImageCarousel id="building-panoramas-carousel" height="300px" images={imagesState.buildingImages.filter(image => image.type === ImageType.Building).map(image => image.path)} />
          </div>
          {/* Info */}
          <div className="col">
            {/* Building Name Header */}
            <div className="row">
              <div className="col" id="#official-name">
                <h2>Official Name</h2>
              </div>
              <div className="col">
                <div className="d-flex justify-content-end">
                  <Button
                    preventDefault
                    buttonType={ButtonType.Primary}
                    onClick={() => {
                      const newName: string | undefined = showEditPrompt(building.officialName);
                      if (newName === undefined) return;
                      console.log(`Updating building name from ${building.officialName} to ${newName}`);
                      updateBuilding(building, {
                        ...building,
                        officialName: newName,
                      });
                    }}
                  >
                    <span>Edit</span>
                  </Button>
                </div>
              </div>
            </div>
            {/* Building Name */}
            <div className="row">
              <div className="col">
                <p>{building.officialName}</p>
              </div>
            </div>
            {/* Nicknames Header */}
            <div className="row">
              <div className="col">
                <h2>Nicknames</h2>
              </div>
              <div className="col">
                <div className="d-flex justify-content-end">
                  <Button preventDefault buttonType={ButtonType.Primary}>
                    <span>Edit</span>
                  </Button>
                </div>
              </div>
            </div>
            {/* Nicknames */}
            <div className="row">
              <div className="col">
                <p>{building.nicknames.join(", ")}</p>
              </div>
            </div>
            {/* Description Header */}
            <div className="row">
              <div className="col">
                <h2>Description</h2>
              </div>
              <div className="col">
                <div className="d-flex justify-content-end">
                  <Button buttonType={ButtonType.Primary} preventDefault>
                    <span>Edit</span>
                  </Button>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="row">
              <div className="col">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum quibusdam nisi nihil repudiandae quidem ipsam? Perferendis aliquid, eum cupiditate temporibus qui eos totam laborum
                  libero animi nulla et consequatur corporis. Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Header */}
        <div className="row">
          <div className="col">
            <h2>Rooms</h2>
          </div>
        </div>
        {/* Room Cards */}
        <div className="row">
          <div className="col">
            {rooms.length > 0 ? (
              <RoomCardsDeck rooms={rooms} roomsImages={roomsImages} />
            ) : (
              <>
                <p className="my-0">
                  There are no rooms for this building. &nbsp;
                  <Link to="rooms/add">Add Room</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <FloatingGroup orientation={FloatingGroupOrientation.Horizontal} bottom left>
        <Button
          preventDefault
          buttonType={ButtonType.Danger}
          onClick={() => {
            const confirmDelete = showConfirmPrompt("Are you sure that you want to delete this building?\n\nNote: This action can not be undone.");
            if (!confirmDelete) return;
            removeBuilding(buildingName);
          }}
        >
          <span>
            <FontAwesomeIcon icon={faMinusCircle} />
            &nbsp;Delete Building
          </span>
        </Button>
      </FloatingGroup>
    </>
  );
};

const mapStateToProps = (state: AppState, props: Props) => ({
  buildingsState: state.buildings,
  imagesState: state.images,

  buildingName: props.match.params.buildingName,
});

export default connect(mapStateToProps, {
  fetchBuildings,
  updateBuilding,
  removeBuilding,

  fetchBuildingImages,
  fetchRoomImagesForBuilding,
})(BuildingSection);
