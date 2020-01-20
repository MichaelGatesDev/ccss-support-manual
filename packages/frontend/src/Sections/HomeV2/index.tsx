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
import { SiteNavigation } from "../../Components/SiteNavigation";


const DefaultSection = (props: { onSearchChange: (newValue: string) => void }): JSX.Element => {
  useEffect(() => {
    // focus and keep search focused
    jQuery("#search-lg").focus();
    jQuery("#search-lg").blur(() => { jQuery("#search-lg").focus(); });
  }, []);
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

export default (): JSX.Element => {

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {

    // fetch buildings
    // fetch rooms

    // focus and keep search focused
    jQuery("#search").focus();
    jQuery("#search").blur(() => { jQuery("#search").focus(); });
  }, [searchQuery]);

  const queries = searchQuery.split(" ").filter((q) => !StringUtils.isBlank(q));

  return (
    <>
      <Container fluid as="section" id="home-v2">
        {StringUtils.isBlank(searchQuery) && (
          <DefaultSection
            onSearchChange={(newValue: string): void => {
              setSearchQuery(newValue);
              setTimeout(() => jQuery("#search").focus(), 10);
            }}
          />
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
