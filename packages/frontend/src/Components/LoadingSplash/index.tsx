import React, { PureComponent } from "react";

import "./style.scss";

class LoadingSplash extends PureComponent {
  render() {
    return (
      <div className="LoadingSplash-Component">
        <p className="text">Loading... </p>
        <p className="loading-icon-container">
          <i className="fas fa-spinner loading-icon" />
        </p>
      </div>
    );
  }
}

export default LoadingSplash;
