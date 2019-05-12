import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from 'react-redux'

import './App.css';

import Home from './Sections/Home/Home';
import Room from './Sections/Room/Room';

import Footer from "./Components/Footer/Footer";
import BackToTopButton from "./Components/BackToTopButton/BackToTopButton";

import { store } from './redux/store';

class App extends Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <BackToTopButton
            minScrollAmt={50}
          />
          <div className="App">
            <Route exact path="/" component={Home} />
            {/* <Route exact path="/buildings/create" component={CreateBuilding} /> */}
            {/* <Route path="/buildings/:building" component={Buildings} /> */}
            {/* <Route path="/buildings/:building/rooms" component={Rooms} /> */}
            {/* <Route path="/rooms/:roomID" component={Room} /> */}
            <Route path="/buildings/:buildingName/rooms/:roomNumber" component={Room} />
            <footer>
              <Footer />
            </footer>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;