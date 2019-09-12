import "./style.scss";

import React, { Component } from "react";
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

export default class TroubleshootingTips extends Component<Props, State> {
  render() {
    const {
      troubleshootingData,
      typeFilters,
      tagFilters,
      search,
    } = this.props;

    let data = troubleshootingData;

    data = data.filter(item => {
      if (item.types.length === 0) return true;
      for (const typeFilter of typeFilters) {
        if (item.types.includes(typeFilter)) return true;
      }
      return false;
    }, this);


    if (tagFilters.length > 0) {
      data = data.filter(item => {
        for (const tagFilter of tagFilters) {
          if (item.tags.includes(tagFilter)) return true;
        }
        return false;
      }, this);
    }


    const queries = search.split(" ");
    for (const q of queries) {
      data = data.filter(item => (item.title.includes(q) || item.description.includes(q) || item.types.includes(q) || item.tags.includes(q)), this);
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
