import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Room, ImageType } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";
import RoomCardsGrid from "../../Components/RoomCardsGrid";

import { AppState } from "../../redux/store";
import { fetchBuilding, fetchBuildings } from "../../redux/buildings/actions";
import { fetchBuildingImages, fetchRoomImagesForBuilding } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import ImageCarousel from "../../Components/ImageCarousel";
import Button from "../../Components/Button";

interface Props {
  match?: any;

  buildingName: string;

  buildingsState: BuildingsState;
  imagesState: ImagesState;

  fetchBuildings: Function;
  fetchBuilding: Function;
  fetchBuildingImages: Function;
  fetchRoomImagesForBuilding: Function;
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
      fetchRoomImagesForBuilding,
    } = this.props;
    fetchBuildings();
    fetchBuilding(buildingName);
    fetchBuildingImages(buildingName);
    fetchRoomImagesForBuilding(buildingName);
  }

  onSearch(value: string) {
    this.setState({
      filterSearch: value,
    });
  }

  private isLoading(): boolean {
    const { buildingsState, imagesState } = this.props;
    return buildingsState.fetchingBuildings || imagesState.imagesLoading;
  }

  private filterRoomsByName(rooms: Room[], name: string, filterNumber: boolean = true, filterName: boolean = true, filterBuildingName: boolean = true): Room[] {
    const { buildingsState } = this.props;
    return rooms.filter((room: Room) => {
      const pb = BuildingUtils.getParentBuilding(room, buildingsState.fetchedBuildings ?? []);
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
    const building = buildingsState.fetchedBuilding;

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
      <>
        {/* Top navigation */}
        <NavBar
          title="CCSS Support Manual"
          searchable
          onSearch={this.onSearch}
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
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><a href="/buildings">Buildings</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{building.officialName}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="row">
            {/* Photos */}
            <div className="col-sm">
              <ImageCarousel
                id="building-panoramas-carousel"
                height="300px"
                images={imagesState.buildingImages.filter((image) => image.type === ImageType.Building).map((image) => image.path)}
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
                    <Button preventDefault>
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
                    <Button preventDefault>
                      <span>Edit</span>
                    </Button>
                  </div>
                </div>
              </div>
              {/* Nicknames */}
              <div className="row">
                <div className="col">
                  <p>
                    {building.nicknames.join(", ")}
                  </p>
                </div>
              </div>
              {/* Description Header */}
              <div className="row">
                <div className="col">
                  <h2>Description</h2>
                </div>
                <div className="col">
                  <div className="d-flex justify-content-end">
                    <Button preventDefault>
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
                    Perferendis aliquid, eum cupiditate temporibus qui eos totam laborum libero animi nulla et consequatur corporis.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h2>Rooms</h2>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <RoomCardsGrid
                rooms={rooms}
                buildings={buildingsState.fetchedBuildings ?? []}
                images={imagesState}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h2>Admin</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Button preventDefault fullWidth>
                <span>Delete</span>
              </Button>
            </div>
          </div>

        </section>
      </>
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
  {
    fetchBuildings,
    fetchBuilding,
    fetchBuildingImages,
    fetchRoomImagesForBuilding,
  },
)(BuildingSection);
