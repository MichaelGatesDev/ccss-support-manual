import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { StringUtils } from "@michaelgatesdev/common";

import {
  Room,
  Building,
  Classroom,
  ImageType,
} from "@ccss-support-manual/models";
import { BuildingUtils, RoomUtils } from "@ccss-support-manual/utilities";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuildings } from "../../redux/buildings/actions";
import { fetchImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import { CardDeck } from "../../Components/CardDeck";
import { Card, HoverEffect } from "../../Components/Card";
import { RoomCardsDeck } from "../../Components/RoomCardsDeck";

interface Props {
  buildingsState: BuildingsState;
  fetchBuildings: () => void;

  imagesState: ImagesState;
  fetchImages: () => void;
}

const Home = (props: Props) => {

  const [filterSearch, setFilterSearch] = useState<string>("");

  const { fetchBuildings, fetchImages } = props;
  const { buildingsState, imagesState } = props;

  useEffect(() => {
    fetchBuildings();
    fetchImages();
  }, []);

  const isLoading = (): boolean => buildingsState.fetchingBuildings || imagesState.imagesLoading;

  const filterRoomsByName = (rooms: Room[], name: string, filterNumber: boolean = true, filterName: boolean = true, filterBuildingName: boolean = true): Room[] => rooms.filter((room: Room) => {
    const pb: Building | undefined = BuildingUtils.getParentBuilding(room, buildingsState.fetchedBuildings ?? []);
    if (pb === undefined) return false;
    return (
      (filterNumber && `${room.number}`.toLocaleLowerCase().includes(name)) ||
      (filterName && room.name.toLocaleLowerCase().includes(name)) ||
      (filterBuildingName && BuildingUtils.hasName(pb, name))
    );
  });


  // Display splash when loading
  if (isLoading()) {
    return <LoadingSplash />;
  }

  const query = filterSearch;
  const queries = query.split(" ");

  let rooms = _.sortBy(BuildingUtils.getAllRooms(buildingsState.fetchedBuildings ?? []), ["buildingName", "number"]);

  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      rooms = filterRoomsByName(rooms, query);
    }
  }

  const roomsImages = imagesState.roomImages.filter((image) => image.type === ImageType.Room);

  return (
    <>
      {/* Top navigation */}
      <NavBar
        title="CCSS Support Manual"
        searchable
        onSearch={setFilterSearch}
        fixed
      />
      {/* Main content */}
      <section className="container-fluid" id="home-section">
        <div className="row">
          <div className="col">
            <RoomCardsDeck
              rooms={rooms}
              roomsImages={roomsImages}
            />
          </div>
        </div>
      </section>
    </>
  );

};

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
  imagesState: state.images,
});

export default connect(
  mapStateToProps,
  { fetchBuildings, fetchImages },
)(Home);
