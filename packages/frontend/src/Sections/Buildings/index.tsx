import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Room, Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuildings } from "../../redux/buildings/actions";
import { fetchImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import BuildingCardsGrid from "../../Components/BuildingCardsGrid";

interface Props {
  buildingsState: BuildingsState;
  imagesState: ImagesState;

  fetchBuildings: Function;
  fetchImages: Function;
}

interface State {
  filterSearch: string;
}

class Buildings extends Component<Props, State> {
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

  filterBuildingsByName(buildings: Building[], name: string): Building[] {
    return buildings.filter((building: Building) => BuildingUtils.hasName(building, name), this);
  }

  render() {
    // Display splash when loading
    if (this.isLoading()) {
      return <LoadingSplash />;
    }

    const { filterSearch } = this.state;
    const { buildingsState, imagesState } = this.props;
    const { buildings } = buildingsState;

    const query = filterSearch;
    const queries = query.split(" ");

    let filteredBuildings = _.sortBy(buildings, ["internalName"]);

    if (queries.length > 0) {
      for (let query of queries) {
        query = query.toLocaleLowerCase();
        filteredBuildings = this.filterBuildingsByName(filteredBuildings, query);
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
          <BuildingCardsGrid
            buildings={filteredBuildings}
            images={imagesState}
          />
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
)(Buildings);
