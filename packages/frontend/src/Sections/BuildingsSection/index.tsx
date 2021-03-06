import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import "./style.scss";

import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuildings } from "../../redux/buildings/actions";
import { fetchImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import {
  FloatingGroup,
  FloatingGroupOrientation,
} from "../../Components/FloatingGroup";
import { AnchorButton } from "../../Components/AnchorButton";
import { ButtonType } from "../../Components/Button";
import { BuildingCardsDeck } from "../../Components/BuildingCardsDeck";
import Breadcrumbs from "../../Components/Breadcrumbs";

interface Props {
  buildingsState: BuildingsState;
  imagesState: ImagesState;

  fetchBuildings: Function;
  fetchImages: Function;
}

const BuildingsSection = (props: Props) => {
  const [filterSearch, setFilterSearch] = useState<string>("");

  const { buildingsState, imagesState } = props;
  const { fetchBuildings, fetchImages } = props;

  useEffect(() => {
    fetchBuildings();
    fetchImages();
  }, []);

  const isLoading = (): boolean =>
    buildingsState.fetchingBuildings || imagesState.imagesLoading;

  const filterBuildingsByName = (
    buildings: Building[],
    name: string
  ): Building[] =>
    buildings.filter((building: Building) =>
      BuildingUtils.hasName(building, name)
    );

  // Display splash when loading
  if (isLoading()) {
    return <LoadingSplash />;
  }

  const query = filterSearch;
  const queries = query.split(" ");

  let filteredBuildings = _.sortBy(buildingsState.fetchedBuildings, [
    "internalName",
  ]);

  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      filteredBuildings = filterBuildingsByName(filteredBuildings, query);
    }
  }

  return (
    <>
      {/* Main content */}
      <section className="container-fluid" id="home-section">
        <BuildingCardsDeck
          buildings={filteredBuildings}
          buildingsImages={imagesState.buildingImages}
        />

        <FloatingGroup
          orientation={FloatingGroupOrientation.Horizontal}
          bottom
          left
        >
          <AnchorButton href="buildings/add" buttonType={ButtonType.Success}>
            <>
              <span>
                <FontAwesomeIcon icon={faPlusCircle} />
                &nbsp;Add Building
              </span>
            </>
          </AnchorButton>
        </FloatingGroup>
      </section>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
  imagesState: state.images,
});

export default connect(mapStateToProps, { fetchBuildings, fetchImages })(
  BuildingsSection
);
