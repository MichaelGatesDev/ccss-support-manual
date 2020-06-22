import "./style.scss";

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {}

export const SiteNavigation = (): JSX.Element => {
  return (
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
  );
};
