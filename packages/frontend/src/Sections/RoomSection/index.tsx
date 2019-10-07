import "./style.scss";

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ImageType,
  RoomType,
  Classroom,
} from "@ccss-support-manual/models";
import { RoomUtils, TroubleshootingDataUtils } from "@ccss-support-manual/utilities";
import { StringUtils } from "@michaelgatesdev/common";
import _ from "lodash";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { BuildingsState } from "../../redux/buildings/types";
import { TroubleshootingState } from "../../redux/troubleshooting/types";
import { RoomsState } from "../../redux/rooms/types";
import { ImagesState } from "../../redux/images/types";
import { fetchBuilding } from "../../redux/buildings/actions";
import { fetchRoom } from "../../redux/rooms/actions";
import { fetchRoomImagesForRoom } from "../../redux/images/actions";
import { fetchTroubleshootingDataForRoom } from "../../redux/troubleshooting/actions";

import ImageCarousel from "../../Components/ImageCarousel";
import SearchBox from "../../Components/SearchBox";
import TroubleshootingTips from "../../Components/TroubleshootingTips";
import FilterBox from "../../Components/FilterBox";


interface Props {
  match?: any;

  buildingName: string;
  roomNumber: string | number;

  buildingsState: BuildingsState;
  roomsState: RoomsState;
  troubleshootingState: TroubleshootingState;
  imagesState: ImagesState;

  fetchBuilding: Function;
  fetchRoom: Function;
  fetchRoomImagesForRoom: Function;
  fetchTroubleshootingDataForRoom: Function;
}


interface State {
  activeTroubleshootingTypeFilters: string[];
  activeTroubleshootingTagFilters: string[];
  activeTroubleshootingSearchQuery: string;
}


class RoomSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeTroubleshootingTypeFilters: [],
      activeTroubleshootingTagFilters: [],
      activeTroubleshootingSearchQuery: "",
    };

    this.onTypeFilterChange = this.onTypeFilterChange.bind(this);
    this.onTagFilterChange = this.onTagFilterChange.bind(this);
    this.onFilterSearch = this.onFilterSearch.bind(this);
  }

  componentDidMount() {

    const {
      buildingName,
      roomNumber,

      fetchBuilding,
      fetchRoom,
      fetchTroubleshootingDataForRoom,
      fetchRoomImagesForRoom,
    } = this.props;

    fetchBuilding(buildingName);
    fetchRoom(buildingName, roomNumber);
    fetchTroubleshootingDataForRoom(buildingName, roomNumber);
    fetchRoomImagesForRoom(buildingName, roomNumber);
  }

  private isLoading(): boolean {
    const {
      buildingsState,
      roomsState,
      troubleshootingState,
      imagesState,
    } = this.props;
    return buildingsState.buildingsLoading || roomsState.roomsLoading || troubleshootingState.loading || imagesState.imagesLoading;
  }

  onTypeFilterChange(activeTypeFilters: string[]) {
    this.setState({
      activeTroubleshootingTypeFilters: activeTypeFilters,
    });
  }

  onTagFilterChange(activeTagFilters: string[]) {
    this.setState({
      activeTroubleshootingTagFilters: activeTagFilters,
    });
  }

  onFilterSearch(query: string) {
    this.setState({
      activeTroubleshootingSearchQuery: query,
    });
  }

  render() {
    // Display splash when loading
    if (this.isLoading()) {
      return <LoadingSplash />;
    }

    const {
      buildingsState,
      roomsState,
      troubleshootingState,
      imagesState,
    } = this.props;
    const { building } = buildingsState;
    const { room } = roomsState;
    const { data } = troubleshootingState;

    const {
      activeTroubleshootingSearchQuery,
      activeTroubleshootingTypeFilters,
      activeTroubleshootingTagFilters,
    } = this.state;

    if (building === undefined) {
      return <p>Building not found</p>;
    }

    if (room === undefined) {
      return <p>Room not found</p>;
    }

    return (
      <>
        {/* Top navigation */}
        <NavBar
          title="CCSS Support Manual"
          fixed
        />

        {/* Main content */}
        <section className="container" id="room-section">


          {/* Room Title */}
          <div className="row">
            <div className="col text-center">
              <h2 className="room-title capitalized">
                {building.officialName}
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
                  <p className="capitalized">
                    {
                      !RoomUtils.isClassroom(room) || (room as Classroom).phone.extension === "0000"
                        ?
                        "N/A"
                        :
                        (room as Classroom).phone.extension
                    }
                  </p>
                </div>
              </div>
            </div>

          </div>


          {/* Panorama Photos */}
          <div className="row" id="panoramas-row">
            <div className="col">
              <ImageCarousel
                id="room-panoramas-carousel"
                height="200px"
                images={imagesState.roomImages.filter(image => image.type === ImageType.RoomPanorama).map(image => image.path)}
              />
            </div>
          </div>

          {/* Meta */}
          <div className="row">
            {/* Photos */}
            <div className="col-4">
              <ImageCarousel
                id="room-carousel"
                height="300px"
                images={imagesState.roomImages.filter(image => image.type === ImageType.Room).map(image => image.path)}
              />
            </div>
          </div>


          {/* Troubleshooting */}
          <div className="row" id="troubleshooting-row">
            <div className="col-sm-3">
              <SearchBox
                label="Search"
                buttonText="Clear"
                onChange={this.onFilterSearch}
                value={activeTroubleshootingSearchQuery}
              />
              <FilterBox
                label="Type Filters"
                keys={_.sortBy(TroubleshootingDataUtils.getAllTypes(data))}
                buttonText="Reset"
                onChange={this.onTypeFilterChange}
                enabledByDefault
              />
              <FilterBox
                label="Tag Filters"
                keys={_.sortBy(TroubleshootingDataUtils.getAllTags(data))}
                buttonText="Reset"
                onChange={this.onTagFilterChange}
              />
            </div>
            <div className="col">
              <TroubleshootingTips
                troubleshootingData={data}
                typeFilters={activeTroubleshootingTypeFilters}
                tagFilters={activeTroubleshootingTagFilters}
                search={activeTroubleshootingSearchQuery}
              />
            </div>
          </div>

        </section>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => ({
  buildingsState: state.buildings,
  roomsState: state.rooms,
  troubleshootingState: state.troubleshooting,
  imagesState: state.images,

  buildingName: props.match.params.buildingName,
  roomNumber: props.match.params.roomNumber,
});

export default connect(
  mapStateToProps,
  {
    fetchBuilding,
    fetchRoom,
    fetchTroubleshootingDataForRoom,
    fetchRoomImagesForRoom,
  },
)(RoomSection);
