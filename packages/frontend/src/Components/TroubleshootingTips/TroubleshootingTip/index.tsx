import React, { PureComponent } from "react";
import { TroubleshootingData } from "@ccss-support-manual/models";

import "./style.scss";

interface Props {
  data: TroubleshootingData;
}

export default class TroubleshootingTip extends PureComponent<Props> {
  render() {
    const { data } = this.props;
    return (
      <div className="TroubleshootingTip-Component">
        <p className="title capitalized">{data.title}</p>
        <p className="description">{data.description}</p>
        <p className="solution">{data.solution}</p>
        <p className="types">{data.types.length > 0 ? data.types.join(", ") : "N/A"}</p>
        <p className="tags">{data.tags.length > 0 ? data.tags.join(", ") : "N/A"}</p>
      </div>
    );
  }
}
