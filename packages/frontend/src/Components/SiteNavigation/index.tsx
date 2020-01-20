import "./style.scss";

import React from "react";
import {
  Navbar, Row, Nav, Col, InputGroup, FormControl, FormControlProps,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

interface Props {
  brandVisible?: boolean;

  searchID: string;
  searchVisible?: boolean;
  searchPrependIcon?: FontAwesomeIconProps["icon"];
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchAriaDescribedBy?: string;
  searchValue: string;
  onSearchChange?: (newValue: string) => void;
}

export const SiteNavigation = (props: Props): JSX.Element => {

  const {
    brandVisible,

    searchVisible,
    searchPrependIcon,
    searchPlaceholder,
    searchAriaLabel,
    searchAriaDescribedBy,
    onSearchChange,
    searchValue,
    searchID,
  } = props;

  return (
    <Navbar fixed="bottom" collapseOnSelect expand="md" className="flex-column" id="site-nav">
      <Row className="w-100 no-gutters">
        <Col>
          <Navbar.Toggle aria-controls="primary-navbar-nav" />
          <Navbar.Collapse id="primary-navbar-nav">
            {brandVisible && (
              <Navbar.Brand as={Link} to="/v2">Classroom Support Manual</Navbar.Brand>
            )}
            <Nav as={Col} className="justify-content-start">
              <Nav.Item><Nav.Link as={Link} to="/buildings">Buildings</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link as={Link} to="/rooms">Rooms</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link as={Link} to="/troubleshooting">Troubleshooting</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link as={Link} to="/settings">Settings</Nav.Link></Nav.Item>
            </Nav>
            <Nav as={Col} className="justify-content-end">
              <Nav.Item><Nav.Link as={Link} to="/">Master Schedule</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link as={Link} to="/">Room Schedule</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link as={Link} to="/">ServiceNow</Nav.Link></Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Row>
      <Row className="w-100 pt-1 pb-1">
        <Col>
          <InputGroup className="">
            {searchPrependIcon !== undefined && searchVisible && (
              <InputGroup.Prepend>
                <InputGroup.Text id="searchIcon">
                  <FontAwesomeIcon icon={searchPrependIcon} />
                </InputGroup.Text>
              </InputGroup.Prepend>
            )}
            {searchVisible && (
              <FormControl
                id={searchID}
                placeholder={searchPlaceholder}
                aria-label={searchAriaLabel}
                aria-describedby={searchAriaDescribedBy}
                size="lg"
                value={searchValue}
                onChange={(event: any): void => {
                  const { value } = event.target;
                  if (onSearchChange === undefined) return;
                  onSearchChange(value);
                }}
              />
            )}
          </InputGroup>
        </Col>
      </Row>
    </Navbar>
  );
};
