import "./style.scss";

import React, { PureComponent } from "react";
import shortid from "shortid";

import { TroubleshootingData } from "@ccss-support-manual/models";

import TroubleshootingTip from "./TroubleshootingTip";

interface Props {
  troubleshootingData: TroubleshootingData[];
  tagFilters: string[];
  typeFilters: string[];
  search: string;
}

interface State {
}

export default class TroubleshootingTips extends PureComponent<Props, State> {
  render() {
    const {
      troubleshootingData,
      typeFilters,
      tagFilters,
      search,
    } = this.props;

    let data = troubleshootingData;

    data = data.filter((item) => item.types.find((type: string) => typeFilters.includes(type)));
    if (tagFilters.length > 0) data = data.filter((item) => item.tags.find((tag: string) => tagFilters.includes(tag)));

    const queries = search.split(" ");
    for (const q of queries) {
      data = data.filter((item) => ((item).title.includes(q) || item.description.includes(q) || item.types.includes(q) || item.tags.includes(q)), this);
    }


    const tips = data.map((value: TroubleshootingData) => (
      <TroubleshootingTip
        data={value}
        key={shortid.generate()}
      />
    ), this);

    return (
      <div className="TroubleshootingTips-Component">
        <h5>Troubleshooting Tips</h5>
        <hr />
        {
          tips.length > 0 ?
            (
              <ul>
                {tips}
              </ul>
            )
            :
            (
              <p>
                There are no troubleshooting tips that match the filters.
              </p>
            )
        }
      </div>
    );
  }
}
