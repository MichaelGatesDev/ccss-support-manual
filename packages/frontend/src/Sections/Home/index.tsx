import "./style.scss";

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Container as div,
  Nav,
  InputGroup,
  FormControl,
  NavbarBrand,
  Container,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import jQuery from "jquery";
import { StringUtils } from "@michaelgatesdev/common";
import { connect } from "react-redux";
import _ from "lodash";

import { BuildingUtils } from "@ccss-support-manual/utilities";
import { Room, Building } from "@ccss-support-manual/models";

import { fetchBuildings } from "../../redux/buildings/actions";
import { fetchImages } from "../../redux/images/actions";
import { BuildingsState } from "../../redux/buildings/types";
import { ImagesState } from "../../redux/images/types";
import { SiteNavigation } from "../../Components/SiteNavigation";
import { AppState } from "../../redux/store";
import { BuildingCardsDeck } from "../../Components/BuildingCardsDeck";
import { RoomCardsDeck } from "../../Components/RoomCardsDeck";

interface Props {
  buildingsState: BuildingsState;
  fetchBuildings: () => void;

  imagesState: ImagesState;
  fetchImages: () => void;
}

const Home = (props: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    buildingsState,
    fetchBuildings,

    imagesState,
    fetchImages,
  } = props;

  useEffect(() => {
    // fetch buildings (and rooms)
    fetchBuildings();
  }, []);

  const isLoading = (): boolean => buildingsState.fetchingBuildings;
  if (isLoading()) {
    return <p>Loading...</p>;
  }

  const filterRoomsByName = (
    rooms: Room[],
    name: string,
    filterNumber = true,
    filterName = true,
    filterBuildingName = true
  ): Room[] =>
    rooms.filter((room: Room) => {
      const pb: Building | undefined = BuildingUtils.getParentBuilding(
        room,
        buildingsState.fetchedBuildings ?? []
      );
      if (pb === undefined) return false;
      return (
        (filterNumber && `${room.number}`.toLocaleLowerCase().includes(name)) ||
        (filterName && room.name.toLocaleLowerCase().includes(name)) ||
        (filterBuildingName && BuildingUtils.hasName(pb, name))
      );
    });

  const queries = searchQuery.split(" ").filter(q => !StringUtils.isBlank(q));
  let rooms = _.sortBy(
    BuildingUtils.getAllRooms(buildingsState.fetchedBuildings ?? []),
    ["buildingName", "number"]
  );
  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      rooms = filterRoomsByName(rooms, query);
    }
  }

  const SearchBoxComponent = (): JSX.Element => {
    return (
      <div
        id="search-container"
        className={searchQuery != "" ? "stick-bottom" : ""}
      >
        <InputGroup id="search-group">
          <InputGroup.Prepend>
            <InputGroup.Text id="searchIcon">
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id="search-input"
            placeholder="Search for a building or room (e.g. Granite Hall, Granite 072D)"
            size="lg"
            autoFocus
            aria-label="location"
            aria-describedby="searchIcon"
            value={searchQuery}
            onChange={(event: any): void => {
              const { value } = event.target;
              setSearchQuery(value);
            }}
          />
          <InputGroup.Append>
            <InputGroup.Text
              id="searchClearIcon"
              onClick={() => {
                setSearchQuery("");
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  };

  const WelcomeContainerComponent = (): JSX.Element => {
    return (
      <div id="landing">
        <Row className="pb-4">
          <Col className="text-center">
            <h1>Classroom Support Manual</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <SearchBoxComponent />
            <Nav>
              <Nav.Item>
                <Nav.Link as={Link} to="/search">
                  Advanced Search
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </div>
    );
  };

  const SearchResultsComponent = (): JSX.Element => {
    return (
      <div id="search-results">
        <SearchBoxComponent />
        <Row>
          <Col className="text-center">
            {rooms.length > 0 ? (
              <RoomCardsDeck
                rooms={rooms}
                roomsImages={imagesState.allRoomImages}
              />
            ) : (
              <p>No results found :(</p>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <>
      <Container fluid as="section" id="home">
        {StringUtils.isBlank(searchQuery) ? (
          <WelcomeContainerComponent />
        ) : (
          <SearchResultsComponent />
        )}
      </Container>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
  imagesState: state.images,
});

export default connect(mapStateToProps, {
  fetchBuildings,
  fetchImages,
})(Home);
