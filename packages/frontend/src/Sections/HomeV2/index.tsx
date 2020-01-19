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

import { StringUtils } from "@michaelgatesdev/common";
import { SiteNavigation } from "../../Components/SiteNavigation";

export default (): JSX.Element => {

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
  }, []);

  return (
    <>
      <Container fluid as="section" id="home-v2">
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
                  placeholder="Search for a building or room (e.g. Granite Hall, Granite 072D)"
                  aria-label="location"
                  aria-describedby="searchIcon"
                  size="lg"
                  onChange={(event: any): void => {
                    const { value } = event.target;
                    setSearchQuery(value);
                  }}
                />
              </InputGroup>
              <Nav>
                <Nav.Item><Nav.Link as={Link} to="/search">Advanced Search</Nav.Link></Nav.Item>
              </Nav>
            </div>
          </Col>
        </Row>
      </Container>

      <SiteNavigation
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
