import "./style.scss";

import React, { PureComponent } from "react";
import { StringUtils } from "@michaelgatesdev/common";

interface Props {
  items: CollapseItem[];
}
interface State { }

interface CollapseItem {
  show?: boolean;
  title: string;
  content: any;
}

export default class Collapse extends PureComponent<Props, State> {
  render() {

    const { items } = this.props;

    const mapped = items.map(item => (
      <div className="card" key={`card-${StringUtils.internalize(item.title)}`}>
        <div className="card-header" id="headingOne">
          <h2 className="mb-0">
            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              {item.title}
            </button>
          </h2>
        </div>
        <div id="collapseOne" className={`collapse +${(item.show ? " show" : "")}`} aria-labelledby="headingOne" data-parent="#accordionExample">
          <div className="card-body">
            {item.content}
          </div>
        </div>
      </div>
    ));

    return (
      <div className="Collapse-Component">
        <div className="accordion" id="accordionExample">
          {mapped}
        </div>
      </div>
    );
  }
}
