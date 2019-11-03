import React, { PureComponent } from "react";
import shortid from "shortid";

export enum TableDataType {
  Header,
  Data
}

interface Props {
  data?: { type?: TableDataType; content: any }[];
}

export default class TableRow extends PureComponent<Props> {
  render() {
    const { data } = this.props;

    if (data === undefined) return null;

    const mapped = data.map((item) => {
      switch (item.type) {
        default:
          return null;
        case TableDataType.Header:
          return <th key={shortid.generate()}>{item.content}</th>;
        case TableDataType.Data:
          return <td key={shortid.generate()}>{item.content}</td>;
      }
    });

    return (
      <tr className="TableRowComponent">
        {mapped}
      </tr>
    );
  }
}
