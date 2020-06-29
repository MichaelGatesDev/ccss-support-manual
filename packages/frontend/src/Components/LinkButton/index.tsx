import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import "./style.scss";

interface Props {
  href: string;
  title: string;
}

interface State {}

export default class LinkButton extends PureComponent<Props, State> {
  render() {
    const { href, title } = this.props;
    return (
      <div className="LinkButton-Component">
        <Link to={href}>{title}</Link>
      </div>
    );
  }
}
