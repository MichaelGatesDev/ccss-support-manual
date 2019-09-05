import React, { Component, Fragment } from "react";
import _ from "lodash";

import "./style.scss";

import { Building, Room, TroubleshootingData } from "@ccss-support-manual/models";

import NavBar from "../../Components/NavBar";
// import ImageCarousel from "../../Components/ImageCarousel/ImageCarousel";
import FilterBox from "../../Components/FilterBox";
import TroubleshootingTips from "../../Components/TroubleshootingTips";
import SearchBox from "../../Components/SearchBox";
import LoadingSplash from "../../Components/LoadingSplash";

import GeneralInfo from "./GeneralInfo";


interface Props {
  match: any;
}

interface State {
  loading: boolean;
  activeTroubleshootingTypeFilters: string[];
  activeTroubleshootingTagFilters: string[];
  activeSearchQuery: string;

  // images?: any;
  room?: any;
  building?: any;
  troubleshootingData?: any;
}

export default class RoomSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      activeTroubleshootingTypeFilters: [],
      activeTroubleshootingTagFilters: [],
      activeSearchQuery: "",

      // images: undefined,1
      room: undefined,
      troubleshootingData: undefined,
    };

    this.onTypeFilterChange = this.onTypeFilterChange.bind(this);
    this.onTagFilterChange = this.onTagFilterChange.bind(this);
    this.onFilterSearch = this.onFilterSearch.bind(this);
  }

  componentDidMount() {
    this.fetchRoom();
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
      activeSearchQuery: query,
    });
  }

  getAllTroubleshootingDataTags() {
    const { troubleshootingData } = this.state;
    const results: any[] = [];
    troubleshootingData.forEach((td: TroubleshootingData) => {
      td.tags.forEach((tag: string) => {
        if (results.includes(tag.toLowerCase())) return;
        results.push(tag.toLowerCase());
      });
    });
    return _.sortBy(results); // sort alphabetically descending (A-Z)
  }

  getAllTroubleshootingDataTypes() {
    const { troubleshootingData } = this.state;
    const results: any[] = [];
    troubleshootingData.forEach((td: TroubleshootingData) => {
      td.types.forEach((type: string) => {
        if (results.includes(type.toLowerCase())) return;
        results.push(type.toLowerCase());
      });
    });
    return _.sortBy(results); // sort alphabetically descending (A-Z)
  }

  getTitle = (building: Building, room: Room): string => `${building.officialName} ${room.number}`;

  fetchRoom() {
    const { match } = this.props;
    fetch(`/api/v1/buildings/${match.params.buildingName}/rooms/${match.params.roomNumber})`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          room: data,
        });
      }).catch((error: any) => {
        console.log(error);
        console.log("Failed to fetch room");
      });
  }

  // fetchImages() {
  //   const { match } = this.props;
  //   const self = this;
  //   fetch(`/api/v1/images/buildings/${match.params.buildingName}/rooms/${match.params.roomNumber})`)
  //     .then(response => response.json())
  //     .then(data => {
  //       this.setState({
  //         images: data,
  //       }, () => {
  //         self.fetchTroubleshootingData();
  //       });
  //     }).catch(error => {
  //       console.log(error);
  //       console.log("Failed to fetch room images");
  //     });
  // }

  fetchTroubleshootingData() {
    const { match } = this.props;
    fetch(`/api/v1/troubleshooting-data/buildings/${match.params.buildingName}/rooms/${match.params.roomNumber}`)
      .then(response => response.json())
      .then(data => {
        const sortedTypes = _.sortBy(data, (item: any) => item.types);
        this.setState({
          loading: false,
          troubleshootingData: sortedTypes,
        });
      }).catch(error => {
        console.log(error);
        console.log("Failed to fetch room troubleshooting data");
      });
  }

  render() {
    const {
      loading, building, room, troubleshootingData, activeTroubleshootingTypeFilters, activeTroubleshootingTagFilters, activeSearchQuery,
    } = this.state;

    if (loading) return <LoadingSplash />;
    return (
      <Fragment>
        <NavBar
          title="CCSS Support Manual"
          searchable={false}
        />
        <section className="container" id="room-section">

          <GeneralInfo
            title={this.getTitle(building, room)}
            room={room}
          />

          {/* {this.state.images.panoramicImages.length > 0 &&
            <Fragment>
              <div className="row panoramas">
                <div className="col">
                  <ImageCarousel
                    images={this.imagesAsArray(this.state.images.panoramicImages)}
                    height="250px"
                    id="panoramas-carousel"
                  />
                </div>
              </div>
            </Fragment>
          } */}

          <div className="row">
            <div className="col-lg-4">
              {/* <ImageCarousel
                images={this.imagesAsArray(this.state.images.rootImages)}
                height="350px"
                id="main-carousel"
              /> */}
            </div>
            <div className="col-lg-4">
              <h5>Furniture</h5>
              <hr />
              <p className="detail-header">Furniture Type</p>
              <p className="detail capitalized">{room.furnitureType}</p>
              <p className="detail-header">Chair Count</p>
              <p className="detail">{room.chairCount}</p>
              <p className="detail-header">Table Count</p>
              <p className="detail">{room.tableCount}</p>
            </div>

            <div className="col-lg-4">
              <h5>Technology</h5>
              <hr />

              <Fragment>
                <p className="detail-header">
                  Audio
                </p>
                <span>
                  {room.audioRequiresProjector ?
                    (
                      <i
                        className="fas fa-volume-up"
                        style={{ color: "orange" }}
                        data-toggle="tooltip"
                        title="Audio requires projector"
                      />
                    )
                    :
                    (
                      <i
                        className="fas fa-volume-up"
                        style={{ color: "gray" }}
                        data-toggle="tooltip"
                        title="Audio does not require projector"
                      />
                    )
                  }
                </span>
              </Fragment>

            </div>
          </div>

          <hr />

          {/* Troubleshooting stuff begins here */}

          <div className="row">
            <div className="col-sm-3">
              <SearchBox
                label="Search"
                buttonText="Clear"
                onChange={this.onFilterSearch}
                value={activeSearchQuery}
              />
              <FilterBox
                label="Type Filters"
                keys={this.getAllTroubleshootingDataTypes()}
                buttonText="Reset"
                onChange={this.onTypeFilterChange}
                enabledByDefault
              />
              <FilterBox
                label="Tag Filters"
                keys={this.getAllTroubleshootingDataTags()}
                buttonText="Reset"
                onChange={this.onTagFilterChange}
                enabledByDefault={false}
              />
            </div>
            <div className="col">
              <TroubleshootingTips
                troubleshootingData={troubleshootingData}
                typeFilters={activeTroubleshootingTypeFilters}
                tagFilters={activeTroubleshootingTagFilters}
                search={activeSearchQuery}
              />
            </div>
          </div>

          <hr />

          <p>
            Last Updated:
            {room.lastChecked}
          </p>

        </section>
      </Fragment>
    );
  }
}
