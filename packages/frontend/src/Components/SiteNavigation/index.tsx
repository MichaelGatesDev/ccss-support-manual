import "./style.scss";

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import externalNavRoutes from "../../external-nav-routes.json";
import internalNavRoutes from "../../internal-nav-routes.json";

interface Props {}

export const SiteNavigation = (): JSX.Element => {
  return (
    <Navbar fixed="top" id="site-nav">
      <Nav className="mr-auto">
        {Object.keys(internalNavRoutes).map(route => {
          const href = internalNavRoutes[route];
          return (
            <Nav.Item>
              <Nav.Link as={Link} to={href}>
                {route.replace(/\_/, " ")}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      <Nav>
        {Object.keys(externalNavRoutes).map(route => {
          const href = externalNavRoutes[route];
          return (
            <Nav.Item>
              <Nav.Link href={href} target="_blank" rel="noopener noreferrer">
                {route.replace(/\_/, " ")}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </Navbar>
  );
};
