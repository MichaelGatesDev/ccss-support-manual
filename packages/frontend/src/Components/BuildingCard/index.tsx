import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  ImageType,
  BuildingImage,
} from "@ccss-support-manual/models";

import "./style.scss";

interface Props {
  building: Building;
  images: BuildingImage[];
}

interface State { }

export default class BuildingCard extends PureComponent<Props, State> {

  render() {
    const { images, building } = this.props;

    let coverImage = "img/300x200.png";
    if (images.length > 0) {
      const possibleCover = images.find(image => image.type === ImageType.Building);
      if (possibleCover !== undefined) {
        coverImage = possibleCover.path;
      }
    }

    return (
      <div className="BuildingCard-Component">
        <Link to={`buildings/${building.internalName}/`} target="_blank">
          <div className="card">
            <p className="card-meta"> </p>
            <img className="card-img-top" src={escape(coverImage)} alt={building.internalName} />
            <div className="card-body">
              <p className="card-title">{building.officialName}</p>
              <p className="card-subtitle">{building.nicknames ? building.nicknames.join(", ") : <br />}</p>
              {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card"s content.</p> */}
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
