import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Room,
  RoomImage,
  ImageType,
} from "@ccss-support-manual/models";

import "./style.scss";

interface Props {
  building: Building;
  room: Room;
  images: RoomImage[];
}

interface State { }

class RoomCard extends Component<Props, State> {
  getTitle() {
    const { building, room } = this.props;
    return `${building.officialName} ${room.number.toString().toUpperCase()}`;
  }

  render() {
    const { building, room, images } = this.props;

    let coverImage = "img/300x200.png";
    if (images.length > 0) {
      const possibleCover = images.find(image => image.type === ImageType.Room);
      if (possibleCover !== undefined) {
        coverImage = possibleCover.thumbnail.path;
      }
    }

    return (
      <div className="RoomCard-Component">
        <Link to={`/buildings/${building.internalName}/rooms/${room.number}`} target="_blank">
          <div className="card">
            <p className="card-meta"> </p>
            <img className="card-img-top" src={`/${escape(coverImage)}`} alt="" />
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
