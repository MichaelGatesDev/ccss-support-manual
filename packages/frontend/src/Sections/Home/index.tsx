import React, { Component, Fragment } from "react";
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
  imagesState: ImagesState;

  fetchBuildings: Function;
  fetchImages: Function;
}

interface State {
  filterSearch: string;
}

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filterSearch: "",
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    const { fetchBuildings, fetchImages } = this.props;
    fetchBuildings();
    fetchImages();
  }

  onSearch(value: string) {
    this.setState({
      filterSearch: value,
    });
  }

  getParentBuilding(room: Room): Building | undefined {
    const { buildingsState } = this.props;
    for (const building of buildingsState.buildings) {
      if (BuildingUtils.hasName(building, room.buildingName)) return building;
    }
    return undefined;
  }

  getAllRooms(): Room[] {
    const { buildingsState } = this.props;
    let result: Room[] = [];
    for (const building of buildingsState.buildings) {
      result = result.concat(building.rooms);
    }
    return result;
  }

  private isLoading(): boolean {
    const { buildingsState, imagesState } = this.props;
    return buildingsState.buildingsLoading || imagesState.imagesLoading;
  }

  filterRoomsByName(rooms: Room[], name: string, filterNumber: boolean = true, filterName: boolean = true, filterBuildingName: boolean = true): Room[] {
    return rooms.filter((room: Room) => {
      const pb: Building | undefined = this.getParentBuilding(room);
      if (pb === undefined) return false;
      return (
        (filterNumber && `${room.number}`.toLocaleLowerCase().includes(name)) ||
        (filterName && room.name.toLocaleLowerCase().includes(name)) ||
        (filterBuildingName && BuildingUtils.hasName(pb, name))
      );
    }, this);
  }


  render() {
    // Display splash when loading
    if (this.isLoading()) {
      return <LoadingSplash />;
    }


    const { filterSearch } = this.state;
    const { buildingsState, imagesState } = this.props;

    const query = filterSearch;
    const queries = query.split(" ");

    let rooms = _.sortBy(this.getAllRooms(), ["buildingName", "number"]);

    if (queries.length > 0) {
      for (let query of queries) {
        query = query.toLocaleLowerCase();
        rooms = this.filterRoomsByName(rooms, query);
      }
    }

    return (
      <Fragment>
        {/* Top navigation */}
        <NavBar
          title="CCSS Support Manual"
          searchable
          onSearch={this.onSearch}
          fixed
        />
        {/* Main content */}
        <section className="container-fluid" id="home-section">
          <div className="Home-Component">
            <RoomCardsGrid
              rooms={rooms}
              buildings={buildingsState.buildings}
              images={imagesState}
            />
          </div>
        </section>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
  imagesState: state.images,
});

export default connect(
  mapStateToProps,
  { fetchBuildings, fetchImages },
)(Home);
