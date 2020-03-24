import React from "react";

import { Building, BuildingImage } from "@ccss-support-manual/models";

import { CardDeck } from "../CardDeck";
import { Card, HoverEffect } from "../Card";

import placeholder from "../../300x200.png";

interface Props {
  buildings?: Building[];
  buildingsImages: BuildingImage[];
}

export const BuildingCardsDeck = (props: Props) => {
  const { buildings, buildingsImages } = props;
  return (
    <CardDeck center>
      {buildings !== undefined &&
        buildings.map(building => {
          const coverImages = buildingsImages.filter(
            image => image.buildingName === building.internalName
          );
          return (
            <Card
              hoverEffect={HoverEffect.Grayscale}
              className="shadow-sm"
              key={`building-card-${building.internalName}`}
              width="350px"
              img={
                coverImages.length > 0
                  ? `${escape(coverImages[0].thumbnail.path)}`
                  : placeholder
              }
              wrappedURL={`/buildings/${building.internalName}`}
              title={`${building.officialName}`}
              body={
                <>
                  <p className="m-0 pt-3">{building.officialName}</p>
                </>
              }
            />
          );
        })}
    </CardDeck>
  );
};
