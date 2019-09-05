
import React, { Fragment, PureComponent } from "react";

import "./style.scss";

import { Room } from "@ccss-support-manual/models";

interface Props {
  title: string;
  room: Room
}

interface State {
}


export default class GeneralInfo extends PureComponent<Props, State> {
  render() {
    const { title, room } = this.props;
    return (
      <Fragment>
        <div className="GeneralInfo-Component">

          <div className="row">
            <div className="col">
              <h2 className="room-title capitalized">{title}</h2>
            </div>
          </div>

          {room.name &&
            (
              <div className="row">
                <div className="col">
                  <h3>{room.name}</h3>
                </div>
              </div>
            )
          }

          <div className="row">

            <div className="col-lg-4">
              <div className="row">
                <div className="col text-center">
                  <h4>Room Type</h4>
                </div>
              </div>
              <div className="row">
                <div className="col text-center">
                  <p className="capitalized">{room.roomType}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-center">
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
                  {/* <p className="capitalized">{room.phone ? room.phone.extension : "N/A"}</p> */}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Fragment>
    );
  }
}
