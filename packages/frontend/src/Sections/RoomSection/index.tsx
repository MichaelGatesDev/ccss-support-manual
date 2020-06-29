import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ImageType, RoomType, Building } from "@ccss-support-manual/models";
import { RoomUtils, TroubleshootingDataUtils } from "@ccss-support-manual/utilities";
import { StringUtils } from "@michaelgatesdev/common";
import _ from "lodash";

import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { BuildingsState } from "../../redux/buildings/types";
import { TroubleshootingState } from "../../redux/troubleshooting/types";
import { RoomsState } from "../../redux/rooms/types";
import { ImagesState } from "../../redux/images/types";
import { fetchRoom } from "../../redux/rooms/actions";
import { fetchRoomImagesForRoom } from "../../redux/images/actions";
import { fetchTroubleshootingDataForRoom } from "../../redux/troubleshooting/actions";

import ImageCarousel from "../../Components/ImageCarousel";
import SearchBox from "../../Components/SearchBox";
import TroubleshootingTips from "../../Components/TroubleshootingTips";
import FilterBox from "../../Components/FilterBox";
import { SuccessPayload, FailurePayload } from "../../redux/payloads";

interface Props {
  match?: any;

  buildingName: string;
  roomNumber: string | number;

  buildingsState: BuildingsState;
  roomsState: RoomsState;
  troubleshootingState: TroubleshootingState;
  imagesState: ImagesState;

  fetchBuildings: (options?: Partial<Building>) => Promise<SuccessPayload<Building[]> | FailurePayload>;
  fetchRoom: (buildingName: string, roomNumber: string | number) => void;
  fetchRoomImagesForRoom: (buildingName: string, roomNumber: string | number) => void;
  fetchTroubleshootingDataForRoom: (buildingName: string, roomNumber: string | number) => void;
}

const RoomSection = (props: Props) => {
  const [activeTroubleshootingTypeFilters, setActiveTroubleshootingTypeFilters] = useState<string[]>([]);
  const [activeTroubleshootingTagFilters, setActiveTroubleshootingTagFilters] = useState<string[]>([]);
  const [activeTroubleshootingSearchQuery, setActiveTroubleshootingSearchQuery] = useState<string>("");

  const {
    buildingName,
    roomNumber,

    buildingsState,
    roomsState,
    troubleshootingState,
    imagesState,

    fetchBuildings,
    fetchRoom,
    fetchTroubleshootingDataForRoom,
    fetchRoomImagesForRoom,
  } = props;

  useEffect(() => {
    fetchBuildings({ internalName: buildingName });
    fetchRoom(buildingName, roomNumber);
    fetchTroubleshootingDataForRoom(buildingName, roomNumber);
    fetchRoomImagesForRoom(buildingName, roomNumber);
  }, []);

  const buildings = buildingsState.fetchedBuildings;
  if (buildings == null || buildings.length == 0) {
    return <p>Loading buildings...</p>;
  }
  const building = buildings[0];

  const room = roomsState.fetchedRoom;
  if (room === undefined) {
    return <p>Room not found</p>;
  }

  const tsData = troubleshootingState.data;
  if (tsData === undefined) {
    return <p>Troubleshooting Data not found</p>;
  }

  const isLoading = (): boolean => buildingsState.fetchingBuildings || roomsState.fetchingRoom || troubleshootingState.loading || imagesState.imagesLoading;

  // Display splash when loading
  if (isLoading()) {
    return <LoadingSplash />;
  }

  return (
    <>
      {/* Main content */}
      <section className="container" id="room-section">
        {/* Room Title */}
        <div className="row">
          <div className="col text-center">
            <h2 className="room-title capitalized">
              {building.officialName}
              &nbsp;
              {room.number}
            </h2>
          </div>
        </div>

        {/* Room Name */}
        <div className="row">
          <div className="col text-center">
            <h3>{StringUtils.isBlank(room.name) ? "" : room.name}</h3>
          </div>
        </div>

        {/* 3 Column Meta */}
        <div className="row">
          <div className="col-lg">
            <div className="row">
              <div className="col text-center">
                <h4>Room Type</h4>
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <p className="capitalized">{StringUtils.splitCompressedTitle(RoomType[room.roomType]).join(" ")}</p>
              </div>
            </div>
          </div>

          <div className="col-lg text-center">
            <div className="row">
              <div className="col text-center">
                <h4>Room Capacity</h4>
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <p className="capitalized">{room.capacity === -1 ? "N/A" : `${room.capacity}`}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 text-center">
            <div className="row">
              <div className="col text-center">
                <h4>Room Extension</h4>
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <p className="capitalized">{!RoomUtils.isClassroom(room) || (room as Classroom).phone.extension === "0000" ? "N/A" : (room as Classroom).phone.extension}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panorama Photos */}
        <div className="row" id="panoramas-row">
          <div className="col">
            <ImageCarousel id="room-panoramas-carousel" height="200px" images={imagesState.roomImages.filter(image => image.type === ImageType.RoomPanorama).map(image => image.path)} />
          </div>
        </div>

        {/* Meta */}
        <div className="row">
          {/* Photos */}
          <div className="col-4">
            <ImageCarousel id="room-carousel-titles" height="300px" images={imagesState.roomImages.filter(image => image.type === ImageType.RoomTitle).map(image => image.path)} />
          </div>
          {/* Photos */}
          <div className="col-4">
            <ImageCarousel id="room-carousel-room" height="300px" images={imagesState.roomImages.filter(image => image.type === ImageType.Room).map(image => image.path)} />
          </div>
          {/* Photos */}
          <div className="col-4">
            <ImageCarousel id="room-carousel-equipment" height="300px" images={imagesState.roomImages.filter(image => image.type === ImageType.RoomEquipment).map(image => image.path)} />
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="row" id="troubleshooting-row">
          <div className="col-sm-3">
            <SearchBox label="Search" buttonText="Clear" onChange={setActiveTroubleshootingSearchQuery} value={activeTroubleshootingSearchQuery} />
            <FilterBox label="Type Filters" keys={_.sortBy(TroubleshootingDataUtils.getAllTypes(tsData))} buttonText="Reset" onChange={setActiveTroubleshootingTypeFilters} enabledByDefault />
            <FilterBox label="Tag Filters" keys={_.sortBy(TroubleshootingDataUtils.getAllTags(tsData))} buttonText="Reset" onChange={setActiveTroubleshootingTagFilters} />
          </div>
          <div className="col">
            <TroubleshootingTips troubleshootingData={tsData} typeFilters={activeTroubleshootingTypeFilters} tagFilters={activeTroubleshootingTagFilters} search={activeTroubleshootingSearchQuery} />
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state: AppState, props: Props) => ({
  buildingsState: state.buildings,
  roomsState: state.rooms,
  troubleshootingState: state.troubleshooting,
  imagesState: state.images,

  buildingName: props.match.params.buildingName,
  roomNumber: props.match.params.roomNumber,
});

export default connect(mapStateToProps, {
  fetchBuildings,
  fetchRoom,
  fetchTroubleshootingDataForRoom,
  fetchRoomImagesForRoom,
})(RoomSection);
