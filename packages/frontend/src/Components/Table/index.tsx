import "./style.scss";

import React, { PureComponent } from "react";
import shortid from "shortid";

interface Props {
  headers?: string[];
}

export default class Table extends PureComponent<Props> {
  render() {
    const { headers, children } = this.props;
    return (
      <div className="Table-Component">
        <table className="table">
          {headers !== undefined &&
            (
              <thead>
                <tr>
                  {
                    headers.map(header => (
                      <th scope="col" key={shortid.generate()}>{header}</th>
                    ))
                  }
                </tr>
              </thead>
            )
          }
          <tbody>
            {children}
          </tbody>
        </table>
      </div>
    );
  }
}
