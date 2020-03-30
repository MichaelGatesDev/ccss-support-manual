import "./style.scss";

import React from "react";
import {
  Navbar,
  Row,
  Nav,
  Col,
  InputGroup,
  FormControl,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

interface Props {
  topNavigationVisible?: boolean;
  bottomNavigationVisible?: boolean;
  searchID: string;
  searchPrependIcon?: FontAwesomeIconProps["icon"];
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchAriaDescribedBy?: string;
  searchValue: string;
  onSearchChange?: (newValue: string) => void;
}

export const SiteNavigation = (props: Props): JSX.Element => {
  const {
    topNavigationVisible,
    bottomNavigationVisible,
    searchID,
    searchPrependIcon,
    searchPlaceholder,
    searchAriaLabel,
    searchAriaDescribedBy,
    searchValue,
    onSearchChange,
  } = props;

  return (
    <>
      {topNavigationVisible && (
        <Navbar fixed="top" id="site-nav">
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link
                href="https://banner.plattsburgh.edu/pls/prod/psu_genweb.master_sched_search"
                target="_blank"
                rel="noopener noreferrer"
              >
                Master Schedule
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="https://booking.plattsburgh.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Room Schedule
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="https://suny.service-now.com/navpage.do"
                target="_blank"
                rel="noopener noreferrer"
              >
                ServiceNow
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item>
              <Nav.Link as={Link} to="/settings">
                <small>Settings</small>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      )}
      {bottomNavigationVisible && (
        <Navbar
          fixed="bottom"
          collapseOnSelect
          expand="md"
          className="pb-3"
          id="site-nav"
        >
          <Container fluid>
            <Row className="w-100 no-gutters">
              <Col xs="auto">
                <Navbar.Brand as={Link} to="/v2">
                  Classroom Support Manual
                </Navbar.Brand>
              </Col>
              <Col>
                <InputGroup id="search-box" className="h-100">
                  {searchPrependIcon !== undefined && (
                    <InputGroup.Prepend>
                      <InputGroup.Text id="searchIcon">
                        <FontAwesomeIcon icon={searchPrependIcon} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  )}
                  <FormControl
                    id={searchID}
                    className="h-auto"
                    autoFocus
                    placeholder={searchPlaceholder}
                    aria-label={searchAriaLabel}
                    aria-describedby={searchAriaDescribedBy}
                    value={searchValue}
                    onChange={(event: any): void => {
                      const { value } = event.target;
                      if (onSearchChange === undefined) return;
                      onSearchChange(value);
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </Navbar>
      )}
    </>
  );
};
