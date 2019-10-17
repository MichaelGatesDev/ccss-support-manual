import "./style.scss";

import React, { ChangeEvent, Component } from "react";
import { StringUtils } from "@michaelgatesdev/common";

export interface SelectComponentProps {
  placeholder?: string;
  values?: string[];
  current?: string;
  readonly?: boolean;
  size?: number;
  onChange: (value: string | undefined) => void;
}

export default class Select extends Component<SelectComponentProps> {

  onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { onChange, placeholder } = this.props;
    onChange(value === placeholder ? undefined : value);
  };

  render() {
    const {
      placeholder,
      values,
      current,
      readonly,
      size,
    } = this.props;
    return (
      <div className="Select-Component">
        <select disabled={readonly} value={current} onChange={this.onChange} size={size}>
          {
            size !== undefined && size <= 1 &&
            <option>{placeholder}</option>
          }
          {
            values !== undefined &&
            values.map(value => (
              <option
                key={StringUtils.internalize(value)}
                value={value}
              >
                {value}
              </option>
            ))
          }
        </select>
      </div>
    );
  }
}
