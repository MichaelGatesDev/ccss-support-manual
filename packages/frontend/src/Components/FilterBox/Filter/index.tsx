import React, { Component } from "react";

import "./style.scss";

interface Props {
  name: string;
  selected: boolean;
  onChange: any;
}

interface State {
}

class Filter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
  }

  onSelect() {
    const { onChange, name, selected } = this.props;
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
