import "./style.scss";

import React, { PureComponent, ChangeEvent } from "react";
import shortid from "shortid";

interface Props {
  values?: string[];
  current?: string;
  readonly?: boolean;
  size?: number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default class Select extends PureComponent<Props> {
  render() {
    const {
      values,
      current,
      readonly,
      size,
      onChange,
    } = this.props;
    if (values === undefined) return null;
    return (
      <div className="Select-Component">
        <select disabled={readonly} value={current} onChange={onChange} size={size}>
          {values.map(value => (<option key={shortid.generate()}>{value}</option>))}
        </select>
      </div>
    );
  }
}