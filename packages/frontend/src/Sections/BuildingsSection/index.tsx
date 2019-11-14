import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Room, Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import "./style.scss";

import NavBar from "../../Components/NavBar";
import LoadingSplash from "../../Components/LoadingSplash";

import { AppState } from "../../redux/store";
import { fetchBuildings } from "../../redux/buildings/actions";
import { fetchImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import BuildingCardsGrid from "../../Components/BuildingCardsGrid";
import { FloatingGroup, FloatingGroupOrientation } from "../../Components/FloatingGroup";
import { AnchorButton } from "../../Components/AnchorButton";

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


  const isLoading = (): boolean => buildingsState.fetchingBuildings || imagesState.imagesLoading;

  const filterBuildingsByName = (buildings: Building[], name: string): Building[] => buildings.filter((building: Building) => BuildingUtils.hasName(building, name));


  // Display splash when loading
  if (isLoading()) {
    return <LoadingSplash />;
  }

  const query = filterSearch;
  const queries = query.split(" ");

  let filteredBuildings = _.sortBy(buildingsState.fetchedBuildings, ["internalName"]);

  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      filteredBuildings = filterBuildingsByName(filteredBuildings, query);
    }
  }

  return (
    <>
      {/* Top navigation */}
      <NavBar
        title="CCSS Support Manual"
        searchable
        onSearch={setFilterSearch}
        fixed
      />
      {/* Main content */}
      <section className="container-fluid" id="home-section">
        <BuildingCardsGrid
          buildings={filteredBuildings}
          images={imagesState}
        />
        <FloatingGroup orientation={FloatingGroupOrientation.Horizontal} bottom left>
          <AnchorButton
            href="buildings/add"
            content={(
              <span>
                Add
                <i className="fas fa-plus" />
              </span>
            )}
          />
          <AnchorButton
            href="buildings/remove"
            content={(
              <span>
                Remove
                <i className="fas fa-minus" />
              </span>
            )}
          />
        </FloatingGroup>
      </section>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
  imagesState: state.images,
});

export default connect(
  mapStateToProps,
  { fetchBuildings, fetchImages },
)(BuildingsSection);
