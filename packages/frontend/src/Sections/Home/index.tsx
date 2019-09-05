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

  getParentBuilding(room: Room): Building | null {
    const { buildingsState } = this.props;
    for (const building of buildingsState.buildings) {
      if (room.buildingName === building.internalName) return building;
    }
    return null;
  }

  getAllRooms(): Room[] {
    const { buildingsState } = this.props;
    let result: Room[] = [];
    for (const building of buildingsState.buildings) {
      result = result.concat(building.rooms);
    }
    return result;
  }

  isLoading(): boolean {
    const { buildingsState, imagesState } = this.props;
    return buildingsState.buildingsLoading || imagesState.imagesLoading;
  }


  filterRoomsByName(rooms: Room[], name: string, filterNumber: boolean = true, filterName: boolean = true, filterBuildingName: boolean = true): Room[] {
    const self = this;
    return rooms.filter((room: Room) => {
      const pb = self.getParentBuilding(room);
      if (!pb) return false;
      return (
        (filterNumber && room.number.toLocaleLowerCase().includes(name)) ||
        (filterName && room.name.toLocaleLowerCase().includes(name)) ||
        (filterBuildingName && BuildingUtils.hasName(pb, name))
      );
    }, this);
  }


  render() {
    const { filterSearch } = this.state;
    const { buildingsState, imagesState } = this.props;

    let rooms: Room[] = this.getAllRooms();
    if (!this.isLoading()) {
      const query = filterSearch;
      const queries = query.split(" ");

      rooms = _.sortBy(rooms, ["buildingName", "number"]);

      for (let query of queries) {
        query = query.toLocaleLowerCase();
        rooms = this.filterRoomsByName(rooms, query);
      }
    }

    return (
      <Fragment>

        {this.isLoading() &&
          <LoadingSplash />
        }

        {!this.isLoading() &&
          (
            <Fragment>
              <NavBar
                title="CCSS Support Manual"
                searchable
                onSearch={this.onSearch}
                fixed
              />
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
          )
        }
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
