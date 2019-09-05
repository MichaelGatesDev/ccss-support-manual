import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Building, Room } from "@ccss-support-manual/models";

import "./style.scss";

interface Props {
  building: Building;
  room: Room;
  images: any; // TODO make this explicit
}

interface State { }

class RoomCard extends Component<Props, State> {
  getTitle() {
    const { building, room } = this.props;
    return `${building.officialName} ${room.number}`;
  }

  render() {
    const { images, room } = this.props;

    let coverImage = "img/300x200.png";
    if (images) {
      if (images.rootImages && images.rootImages.length > 0) {
        coverImage = images.rootImages[0].url;
      }
    }

    return (
      <div className="RoomCard-Component">
        <Link to={`buildings/${room.buildingName}/rooms/${room.number}`} target="_blank">
          <div className="card">
            <p className="card-meta"> </p>
            <img className="card-img-top" src={coverImage} alt={`${this.getTitle()}`} />
            <div className="card-body">
              <p className="card-title">{this.getTitle()}</p>
              <p className="card-subtitle">{room.name ? room.name : <br />}</p>
              {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card"s content.</p> */}
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default RoomCard;
