import "./style.scss";

import React, { Component } from "react";
import { connect } from "react-redux";
import { ImageType } from "@ccss-support-manual/models";


import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuilding } from "../../redux/buildings/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { RoomsState } from "../../redux/rooms/types";
import { fetchRoom } from "../../redux/rooms/actions";
import { ImagesState } from "../../redux/images/types";
import { fetchRoomImagesForRoom } from "../../redux/images/actions";
import ImageCarousel from "../../Components/ImageCarousel";

interface Props {
  match?: any;

  buildingName: string;
  roomNumber: string | number;

  buildingsState: BuildingsState;
  roomsState: RoomsState;
  imagesState: ImagesState;

  fetchBuilding: Function;
  fetchRoom: Function;
  fetchRoomImagesForRoom: Function;
}

interface State {
}

class RoomSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {

    const {
      buildingName,
      roomNumber,

      fetchBuilding,
      fetchRoom,
      fetchRoomImagesForRoom,
    } = this.props;

    console.log(`${buildingName} ${roomNumber}`);

    fetchBuilding(buildingName);
    fetchRoom(buildingName, roomNumber);
    fetchRoomImagesForRoom(buildingName, roomNumber);
  }

  private isLoading(): boolean {
    const { buildingsState, imagesState } = this.props;
    return buildingsState.buildingsLoading || imagesState.imagesLoading;
  }

  render() {
    // Display splash when loading
    if (this.isLoading()) {
      return <LoadingSplash />;
    }

    const { buildingsState, imagesState } = this.props;
    const { building } = buildingsState;

    if (building === undefined) {
      return <p>Building not found</p>;
    }

    return (
      <>
        {/* Top navigation */}
        <NavBar
          title="CCSS Support Manual"
          fixed
        />
        {/* Main content */}
        <section className="container" id="building-section">

          {/* Meta */}
          <div className="row">
            {/* Photos */}
            <div className="col-sm">
              <ImageCarousel
                id="room-panoramas-carousel"
                height="300px"
                images={imagesState.roomImages.filter(image => image.type === ImageType.RoomPanorama).map(image => image.path)}
              />
            </div>
            {/* Info */}
            <div className="col">
              {/* Building Name Header */}
              <div className="row">
                <div className="col">
                  <h2>Official Name</h2>
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
              </div>
              {/* Nicknames */}
              <div className="row">
                <div className="col">
                  <p>
                    Nicknames:&nbsp;
                    {building.nicknames.join(", ")}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h2>Description</h2>
                </div>
              </div>
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

        </section>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => ({
  buildingsState: state.buildings,
  roomsState: state.rooms,
  imagesState: state.images,

  buildingName: props.match.params.buildingName,
  roomNumber: props.match.params.roomNumber,
});

export default connect(
  mapStateToProps,
  {
    fetchBuilding,
    fetchRoom,
    fetchRoomImagesForRoom,
  },
)(RoomSection);
