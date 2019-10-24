import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Room, Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuildings } from "../../redux/buildings/actions";
import { fetchImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";

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

  const isLoading = (): boolean => buildingsState.buildingsLoading || imagesState.imagesLoading;

  const filterRoomsByName = (rooms: Room[], name: string, filterNumber: boolean = true, filterName: boolean = true, filterBuildingName: boolean = true): Room[] => {
    const { buildings } = buildingsState;
    return rooms.filter((room: Room) => {
      const pb: Building | undefined = BuildingUtils.getParentBuilding(room, buildings);
      if (pb === undefined) return false;
      return (
        (filterNumber && `${room.number}`.toLocaleLowerCase().includes(name)) ||
        (filterName && room.name.toLocaleLowerCase().includes(name)) ||
        (filterBuildingName && BuildingUtils.hasName(pb, name))
      );
    });
  };


  // Display splash when loading
  if (isLoading()) {
    return <LoadingSplash />;
  }

  const { buildings } = buildingsState;

  const query = filterSearch;
  const queries = query.split(" ");

  let rooms = _.sortBy(BuildingUtils.getAllRooms(buildings), ["buildingName", "number"]);

  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      rooms = filterRoomsByName(rooms, query);
    }
  }

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
        <RoomCardsGrid
          rooms={rooms}
          buildings={buildingsState.buildings}
          images={imagesState}
        />
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
