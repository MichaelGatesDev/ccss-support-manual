import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Room, Building, ImageType } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";
import RoomCardsGrid from "../../Components/RoomCardsGrid";

import { AppState } from "../../redux/store";
import { fetchBuilding, fetchBuildings } from "../../redux/buildings/actions";
import { fetchBuildingImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import ImageCarousel from "../../Components/ImageCarousel";

interface Props {
  match?: any;

  buildingName: string;

  buildingsState: BuildingsState;
  imagesState: ImagesState;

  fetchBuildings: Function;
  fetchBuilding: Function;
  fetchBuildingImages: Function;
}

interface State {
  filterSearch: string;
}

class BuildingSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filterSearch: "",
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    const {
      buildingName,
      fetchBuildings,
      fetchBuilding,
      fetchBuildingImages,
    } = this.props;
    fetchBuildings();
    fetchBuilding(buildingName);
    fetchBuildingImages(buildingName);
  }

  onSearch(value: string) {
    this.setState({
      filterSearch: value,
    });
  }

  private isLoading(): boolean {
    const { buildingsState, imagesState } = this.props;
    return buildingsState.buildingsLoading || imagesState.imagesLoading;
  }

  private getParentBuilding(room: Room): Building | undefined {
    const { buildingsState } = this.props;
    for (const building of buildingsState.buildings) {
      if (BuildingUtils.hasName(building, room.buildingName)) return building;
    }
    return undefined;
  }

  private filterRoomsByName(rooms: Room[], name: string, filterNumber: boolean = true, filterName: boolean = true, filterBuildingName: boolean = true): Room[] {
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
    const { building, buildings } = buildingsState;

    if (building === undefined) {
      return <p>Building not found</p>;
    }

    const query = filterSearch;
    const queries = query.split(" ");


    let rooms = _.sortBy(building.rooms, ["number"]);

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
          <h2>{building.officialName}</h2>
          <ImageCarousel
            id="building-panoramas-carousel"
            height="300"
            images={imagesState.buildingImages.filter(image => image.type === ImageType.Building).map(image => image.path)}
          />
          <RoomCardsGrid
            rooms={rooms}
            buildings={buildings}
            images={imagesState}
          />
        </section>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => ({
  buildingsState: state.buildings,
  imagesState: state.images,

  buildingName: props.match.params.buildingName,
});

export default connect(
  mapStateToProps,
  { fetchBuildings, fetchBuilding, fetchBuildingImages },
)(BuildingSection);
