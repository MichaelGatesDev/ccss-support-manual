import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.scss";

// -- START BOOTSTRAP --
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "popper.js/dist/umd/popper.min";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery.slim";
// -- END BOOTSTRAP --

import { store } from "./redux/store";

import Settings from "./Sections/Settings";
import BuildingSection from "./Sections/BuildingSection";
import BuildingsSection from "./Sections/BuildingsSection";

import BackToTopButton from "./Components/BackToTopButton";
import RoomSection from "./Sections/RoomSection";
import AddBuildingSection from "./Sections/AddBuildingSection";
import Home from "./Sections/Home";
import { SiteNavigation } from "./Components/SiteNavigation";
import Breadcrumbs from "./Components/Breadcrumbs";

const App = (): JSX.Element => (
  <Provider store={store}>
    <HashRouter basename="/">
      {/* Back to top button */}
      <BackToTopButton minScrollAmt={50} />
      <SiteNavigation />

      <div className="App">
        <div className="container">
          <Breadcrumbs />
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/settings" component={Settings} />

          {/* <Route exact path="/buildings" component={BuildingsSection} /> */}
          {/* <Route exact path="/buildings/add" component={AddBuildingSection} /> */}
          {/* <Route exact path="/buildings/:buildingName" component={BuildingSection} /> */}
          {/* <Route exact path="/buildings/:buildingName/rooms/:roomNumber" component={RoomSection} /> */}
        </Switch>
      </div>
    </HashRouter>
  </Provider>
);
export default App;
