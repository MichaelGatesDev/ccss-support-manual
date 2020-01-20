import "./style.scss";

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Container,
  Nav,
  InputGroup,
  FormControl,
  NavbarBrand,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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

const HomeV2 = (props: Props): JSX.Element => {

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

    jQuery("#search").focus();
  }, []);

  // keep search focused
  jQuery("#search").blur(() => { jQuery("#search").focus(); });

  const isLoading = (): boolean => buildingsState.fetchingBuildings;
  if (isLoading()) {
    return <p>Loading...</p>;
  }


  const filterRoomsByName = (rooms: Room[], name: string, filterNumber = true, filterName = true, filterBuildingName = true): Room[] => rooms.filter((room: Room) => {
    const pb: Building | undefined = BuildingUtils.getParentBuilding(room, buildingsState.fetchedBuildings ?? []);
    if (pb === undefined) return false;
    return (
      (filterNumber && `${room.number}`.toLocaleLowerCase().includes(name)) ||
      (filterName && room.name.toLocaleLowerCase().includes(name)) ||
      (filterBuildingName && BuildingUtils.hasName(pb, name))
    );
  });

  const queries = searchQuery.split(" ").filter((q) => !StringUtils.isBlank(q));
  let rooms = _.sortBy(BuildingUtils.getAllRooms(buildingsState.fetchedBuildings ?? []), ["buildingName", "number"]);
  if (queries.length > 0) {
    for (let query of queries) {
      query = query.toLocaleLowerCase();
      rooms = filterRoomsByName(rooms, query);
    }
  }


  return (
    <>
      <Container fluid as="section" id="home-v2">
        {StringUtils.isBlank(searchQuery) ?
          (
            <DefaultSection
              onSearchChange={(newValue: string): void => {
                setSearchQuery(newValue);
                setTimeout(() => jQuery("#search").focus(), 1);
              }}
            />
          )
          :
          (
            <div id="search-results">
              {/* <BuildingCardsDeck
                buildings={buildingsState.fetchedBuildings}
                buildingsImages={[]}
              /> */}
              <RoomCardsDeck
                rooms={rooms}
                roomsImages={[]}
              />
            </div>
          )}
      </Container>

      <SiteNavigation
        searchID="search"
        brandVisible={!StringUtils.isBlank(searchQuery)}
        searchVisible={!StringUtils.isBlank(searchQuery)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPrependIcon={faSearch}
        searchPlaceholder="Search for a building or room (e.g. Granite Hall, Granite 072D)"
        searchAriaLabel="location"
        searchAriaDescribedBy="searchIcon"
      />
    </>
  );
};


const DefaultSection = (props: { onSearchChange: (newValue: string) => void }): JSX.Element => {

  useEffect(() => {
    jQuery("#search-lg").focus();
  }, []);

  // keep search focused
  jQuery("#search-lg").blur(() => { jQuery("#search-lg").focus(); });

  return (
    <>
      <Row className="pb-4">
        <Col className="text-center">
          <NavbarBrand>
            <h1>Classroom Support Manual</h1>
          </NavbarBrand>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={12} md={9}>
          <div id="search-container">
            <InputGroup className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="searchIcon">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                id="search-lg"
                placeholder="Search for a building or room (e.g. Granite Hall, Granite 072D)"
                aria-label="location"
                aria-describedby="searchIcon"
                size="lg"
                onChange={(event: any): void => {
                  const { value } = event.target;
                  props.onSearchChange(value);
                }}
              />
            </InputGroup>
            <Nav>
              <Nav.Item><Nav.Link as={Link} to="/search">Advanced Search</Nav.Link></Nav.Item>
            </Nav>
          </div>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
  imagesState: state.images,
});

export default connect(
  mapStateToProps,
  {
    fetchBuildings,
    fetchImages,
  },
)(HomeV2);
