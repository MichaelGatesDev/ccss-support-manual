import React from "react";
import {
  Route, Switch, HashRouter,
} from "react-router-dom";
import { Provider } from "react-redux";

import "./App.scss";

import { store } from "./redux/store";

import Home from "./Sections/Home";
import Settings from "./Sections/Settings";
import BuildingSection from "./Sections/BuildingSection";
import BuildingsSection from "./Sections/BuildingsSection";

import BackToTopButton from "./Components/BackToTopButton";
import RoomSection from "./Sections/RoomSection";
import AddBuildingSection from "./Sections/AddBuildingSection";

import "popper.js/dist/umd/popper.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "jquery/dist/jquery.slim";
import HomeV2 from "./Sections/HomeV2";


const App = (): JSX.Element => (
  <Provider store={store}>
    <HashRouter basename="/">
      {/* Back to top button */}
      <BackToTopButton
        minScrollAmt={50}
      />
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/v2" component={HomeV2} />
          <Route path="/settings" component={Settings} />

          <Route exact path="/buildings" component={BuildingsSection} />
          <Route exact path="/buildings/add" component={AddBuildingSection} />
          <Route exact path="/buildings/:buildingName" component={BuildingSection} />
          <Route exact path="/buildings/:buildingName/rooms/:roomNumber" component={RoomSection} />
        </Switch>
      </div>
    </HashRouter>
  </Provider>
);
export default App;
