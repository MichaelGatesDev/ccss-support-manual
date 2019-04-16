import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import './App.css';

import Home from './Sections/Home/Home';
import Settings from './Sections/Settings/Settings';
import Room from './Sections/Room/Room';

import Footer from "./Components/Footer/Footer";
import BackToTopButton from "./Components/BackToTopButton/BackToTopButton";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <BackToTopButton
          minScrollAmt={50}
        />
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route exact path="/settings" component={Settings} />
          {/* <Route exact path="/buildings/create" component={CreateBuilding} /> */}
          {/* <Route path="/buildings/:building" component={Buildings} /> */}
          {/* <Route path="/buildings/:building/rooms" component={Rooms} /> */}
          <Route path="/rooms/:roomID" component={Room} />
          <footer>
            <Footer />
          </footer>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
