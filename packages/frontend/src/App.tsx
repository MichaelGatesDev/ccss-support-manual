import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";

import { store } from "./redux/store";

import Home from "./Sections/Home";
import Settings from "./Sections/Settings";
import BackToTopButton from "./Components/BackToTopButton";

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
          <Route exact path="/settings" component={Settings} />
          {/* <Route exact path="/buildings/create" component={CreateBuilding} /> */}
          {/* <Route path="/buildings/:building" component={Buildings} /> */}
          {/* <Route path="/buildings/:building/rooms" component={Rooms} /> */}
          {/* <Route path="/rooms/:roomID" component={Room} /> */}
          {/* <Route path="/buildings/:buildingName/rooms/:roomNumber" component={Room} /> */}
        </div>
      </BrowserRouter>
    </Provider>
  );
}
