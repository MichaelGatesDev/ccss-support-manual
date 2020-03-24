import React from "react";
import { StringUtils } from "@michaelgatesdev/common";

import {
  Image,
  ImageType,
  Classroom,
  Room,
  RoomImage,
} from "@ccss-support-manual/models";
import { RoomUtils } from "@ccss-support-manual/utilities";

import { CardDeck } from "../CardDeck";
import { Card, HoverEffect } from "../Card";

import placeholder from "../../300x200.png";

interface Props {
  rooms: Room[];
  roomsImages: RoomImage[];
}

export const RoomCardsDeck = (props: Props) => {
  const { rooms, roomsImages } = props;
  return (
    <CardDeck center>
      {rooms.map(room => {
        const coverImages = roomsImages.filter(
          image =>
            image.buildingName === StringUtils.internalize(room.buildingName) &&
            image.roomNumber === room.number.toString()
        );
        const classroom: Classroom | undefined = RoomUtils.isClassroom(room)
          ? (room as Classroom)
          : undefined;
        return (
          <Card
            hoverEffect={HoverEffect.Grayscale}
            className="shadow-sm"
            key={`room-card-${StringUtils.internalize(room.buildingName)}-${
              room.number
            }`}
            width="350px"
            img={
              coverImages.length > 0
                ? `/${escape(coverImages[0].thumbnail.path)}`
                : placeholder
            }
            wrappedURL={`/buildings/${room.buildingName}/rooms/${room.number}`}
            title={`${room.buildingName} ${room.number}`}
            body={
              <>
                {room.name !== undefined && (
                  <p className="m-0 pt-3">{room.name}</p>
                )}
              </>
            }
            footer={
              classroom === undefined ||
              StringUtils.isBlank(classroom.lastChecked as string) ? (
                undefined
              ) : (
                <>
                  <p className="m-0 p-0">{classroom.lastChecked}</p>
                </>
              )
            }
          />
        );
      })}
    </CardDeck>
  );
};
