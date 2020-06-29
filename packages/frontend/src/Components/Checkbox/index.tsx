import React, { Component } from "react";

import "./style.scss";

interface Props {
  id: string;
  text: string;
  name: string;

  onChange: any;
}

interface State {
  checked: boolean;
}

export default class Checkbox extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      checked: true,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {}

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, onChange } = this.props;
    const { checked } = this.state;
    this.setState(
      {
        checked: e.target.checked,
      },
      () => {
        onChange(name, checked);
      }
    );
  }

  render() {
    const { id, text, name } = this.props;
    const { checked } = this.state;
    return (
      <div className="Checkbox-Component">
        <label htmlFor={id} className="uppercase">
          {text}
          &nbsp;
          <input type="checkbox" id={id} name={name} onChange={this.onChange} checked={checked} />
        </label>
      </div>
    );
  }
}
