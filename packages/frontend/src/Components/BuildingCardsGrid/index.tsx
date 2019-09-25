import "./style.scss";

import React, { Component } from "react";
import shortid from "shortid";
import { Building, BuildingImage } from "@ccss-support-manual/models";

import { ImagesState } from "../../redux/images/types";
import BuildingCard from "../BuildingCard";


interface Props {
  buildings: Building[];
  images: ImagesState;
}

interface State {
}

export default class BuildingCardsGrid extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };

    this.getImagesForBuilding = this.getImagesForBuilding.bind(this);
  }

  componentDidMount() {
  }

  getImagesForBuilding(buildingName: string): BuildingImage[] {
    const { images } = this.props;
    if (images === undefined) return [];
    return images.buildingImages.filter(image => image.buildingName === buildingName);
  }

  render() {
    const { buildings } = this.props;

    const items = buildings.map(building => {
      const images = this.getImagesForBuilding(building.internalName);
      return (
        <li key={shortid.generate()}>
          <BuildingCard
            building={building}
            images={images}
          />
        </li>
      );
    });


    return (
      <div className="BuildingCardsGrid-Component">
        <ul>
          {items}
        </ul>
      </div>
    );
  }
}
