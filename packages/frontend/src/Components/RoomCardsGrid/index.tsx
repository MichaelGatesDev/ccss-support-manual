import "./style.scss";

import React, { Component } from "react";
import shortid from "shortid";
import { Room, Building, RoomImage } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import RoomCard from "../RoomCard";
import { ImagesState } from "../../redux/images/types";


interface Props {
  rooms: Room[];
  buildings: Building[];
  images: ImagesState;
}

interface State {
}

export default class RoomCardsGrid extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };

    this.getImagesForRoom = this.getImagesForRoom.bind(this);
  }

  componentDidMount() {
  }

  getImagesForRoom(buildingName: string, roomNumber: string): RoomImage[] {
    const { images } = this.props;
    if (images === undefined) return [];
    return images.roomImages.filter((image) => image.buildingName === buildingName && image.roomNumber === roomNumber);
  }

  render() {
    const { rooms, buildings } = this.props;

    const items = rooms.map((room) => {
      const parentBuilding = BuildingUtils.getParentBuilding(room, buildings);
      if (parentBuilding === undefined) return null;
      const images = this.getImagesForRoom(parentBuilding.internalName, room.number.toString());
      return (
        <li key={shortid.generate()}>
          <RoomCard
            room={room}
            building={parentBuilding}
            images={images}
          />
        </li>
      );
    });


    return (
      <div className="RoomCardsGrid-Component">
        <ul>
          {items}
        </ul>
      </div>
    );
  }
}
