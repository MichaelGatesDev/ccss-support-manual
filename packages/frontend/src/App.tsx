import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";

import { store } from "./redux/store";

import Home from "./Sections/Home";
import Settings from "./Sections/Settings";
import BuildingSection from "./Sections/BuildingSection";
import BuildingsSection from "./Sections/BuildingsSection";

import BackToTopButton from "./Components/BackToTopButton";
import RoomSection from "./Sections/RoomSection";


export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* Back to top button */}
        <BackToTopButton
          minScrollAmt={50}
        />
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/settings" component={Settings} />

          <Route exact path="/buildings" component={BuildingsSection} />
          <Route exact path="/buildings/:buildingName" component={BuildingSection} />
          {/* <Route path="/buildings/:buildingName/rooms" component={Rooms} /> */}
          {/* <Route exact path="/buildings/create" component={CreateBuilding} /> */}

          <Route path="/buildings/:buildingName/rooms/:roomNumber" component={RoomSection} />
          {/* <Route exact path="/buildings/:buildingName/rooms/create" component={CreateRoom} /> */}
        </div>
      </BrowserRouter>
    </Provider>
  );
}
