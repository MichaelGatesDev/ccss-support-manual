import "./style.scss";

import React, { Component } from "react";
import shortid from "shortid";
import { Room, Building, RoomImage } from "@ccss-support-manual/models";

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

    this.getParentBuilding = this.getParentBuilding.bind(this);
    this.getImagesForRoom = this.getImagesForRoom.bind(this);
  }

  componentDidMount() {
  }

  getParentBuilding(roomObj: any) {
    const { buildings } = this.props;
    for (const building of buildings) {
      for (const room of building.rooms) {
        if (room.buildingName === roomObj.buildingName && room.number === roomObj.number) return building;
      }
    }
    return null;
  }

  getImagesForRoom(buildingName: string, roomNumber: string): RoomImage[] {
    const { images } = this.props;
    if (!images) return [];
    const { roomImages } = images;
    if (!roomImages) return [];
    const results = [];
    for (const item of roomImages) {
      if (
        item.buildingName === buildingName &&
        item.roomNumber === roomNumber
      ) {
        results.push(item);
      }
    }
    return [];
  }

  render() {
    const { rooms } = this.props;

    const items = rooms.map(room => {
      const parentBuilding = this.getParentBuilding(room);
      if (!parentBuilding) return null;
      return (
        <li key={shortid.generate()}>
          <RoomCard
            room={room}
            building={parentBuilding}
            images={this.getImagesForRoom(parentBuilding.internalName, `${room.number}`)}
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
