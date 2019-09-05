import React, { PureComponent } from "react";

import "./style.scss";

interface Props { }
interface State { }

class LoadingSplash extends PureComponent<Props, State> {
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
