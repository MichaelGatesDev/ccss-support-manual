import React, { Component } from "react";

import "./style.scss";

interface Props {
  name: string;
  selected: boolean;
  onChange: any;
}

class Filter extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
  }

  onSelect() {
    const { onChange, name, selected } = this.props;
    // console.log(`${name} is now ${!selected}`);
    onChange(name, !selected);
  }

  render() {
    const { name, selected } = this.props;
    return (
      <div className="Filter-Component row" onClick={this.onSelect}>
        <div className="col capitalized">{name}</div>
        <div className="col-mr">
          <input
            type="checkbox"
            checked={selected}
            readOnly
          />
        </div>
      </div>
    );
  }
}

export default Filter;
