import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import { Room, ImageType, Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import {
  fetchBuilding,
  fetchBuildings,
  updateBuilding,
  removeBuilding,
} from "../../redux/buildings/actions";
import {
  fetchBuildingImages,
  fetchRoomImagesForBuilding,
} from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import ImageCarousel from "../../Components/ImageCarousel";
import Button, { ButtonType } from "../../Components/Button";
import { showEditPrompt, showConfirmPrompt } from "../../utils/WindowUtils";
import {
  FloatingGroup,
  FloatingGroupOrientation,
} from "../../Components/FloatingGroup";
import { RoomCardsDeck } from "../../Components/RoomCardsDeck";

interface Props {
  match?: any;

  buildingName: string;

  buildingsState: BuildingsState;
  imagesState: ImagesState;

  fetchBuildings: () => void;
  fetchBuilding: (buildingName: string) => void;
  updateBuilding: (building: Building, newProps: Building) => Promise<void>;
  removeBuilding: (buildingName: string) => void;

  fetchBuildingImages: (buildingName: string) => void;
  fetchRoomImagesForBuilding: (buildingName: string) => void;
}

const BuildingSection = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    buildingsState,
    imagesState,

    buildingName,

    fetchBuildings,
    fetchBuilding,
    updateBuilding,
    removeBuilding,

    fetchBuildingImages,
    fetchRoomImagesForBuilding,
  } = props;

  useEffect(() => {
    fetchBuildings();
    fetchBuilding(buildingName);
    fetchBuildingImages(buildingName);
    fetchRoomImagesForBuilding(buildingName);
  }, []);

  const filterRoomsByName = (
    rooms: Room[],
    name: string,
    filterNumber = true,
    filterName = true,
    filterBuildingName = true
  ): Room[] =>
    rooms.filter((room: Room) => {
      const pb = BuildingUtils.getParentBuilding(
        room,
        buildingsState.fetchedBuildings ?? []
      );
      if (pb === undefined) return false;
      return (
        (filterNumber && `${room.number}`.toLocaleLowerCase().includes(name)) ||
        (filterName && room.name.toLocaleLowerCase().includes(name)) ||
        (filterBuildingName && BuildingUtils.hasName(pb, name))
      );
    });

  const isLoading = (): boolean =>
    buildingsState.fetchingBuilding ||
    buildingsState.fetchingBuildings ||
    imagesState.imagesLoading;

  // if loading
  if (isLoading()) {
    // display splash
    return <LoadingSplash />;
  }

  const building = buildingsState.fetchedBuilding;
  if (building === undefined) {
    return <p>Building not found</p>; // TODO make this nicer
  }

  let rooms = _.sortBy(building.rooms, ["number"]);

  const queries = searchQuery.split(" ");
  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      rooms = filterRoomsByName(rooms, query);
    }
  }

  const roomsImages = imagesState.roomImages.filter(
    image => image.type === ImageType.Room
  );
  console.log(roomsImages.length);

  return (
    <>
      {/* Top navigation */}
      <NavBar
        title="CCSS Support Manual"
        searchable
        onSearch={setSearchQuery}
        fixed
      />
      {/* Main content */}
      <section className="container" id="building-section">
        {/* Breadcrumbs */}
        <div className="container">
          <div className="row">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/buildings">Buildings</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {building.officialName}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="row">
          {/* Photos */}
          <div className="col-12 col-lg-5 mb-4">
            <ImageCarousel
              id="building-panoramas-carousel"
              height="300px"
              images={imagesState.buildingImages
                .filter(image => image.type === ImageType.Building)
                .map(image => image.path)}
            />
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
                      const newName: string | undefined = showEditPrompt(
                        building.officialName
                      );
                      if (newName === undefined) return;
                      console.log(
                        `Updating building name from ${building.officialName} to ${newName}`
                      );
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
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Earum quibusdam nisi nihil repudiandae quidem ipsam?
                  Perferendis aliquid, eum cupiditate temporibus qui eos totam
                  laborum libero animi nulla et consequatur corporis. Lorem
                  ipsum dolor sit amet consectetur, adipisicing elit.
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

      <FloatingGroup
        orientation={FloatingGroupOrientation.Horizontal}
        bottom
        left
      >
        <Button
          preventDefault
          buttonType={ButtonType.Danger}
          onClick={() => {
            const confirmDelete = showConfirmPrompt(
              "Are you sure that you want to delete this building?\n\nNote: This action can not be undone."
            );
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
  fetchBuilding,
  updateBuilding,
  removeBuilding,

  fetchBuildingImages,
  fetchRoomImagesForBuilding,
})(BuildingSection);
