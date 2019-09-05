import React, { Component } from "react";

import "./style.scss";

interface Props {
  selectedByDefault?: boolean;
  alwaysSelected?: boolean;
  onChange: any;
  placeholder: string;
  type: string;
  value: string;
}

interface State {
}

class FormInput extends Component<Props, State> {
  textInput: HTMLInputElement | undefined | null;

  constructor(props: Props) {
    super(props);

    this.state = {
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount() {
    if (!this || !this.textInput) return;

    const { selectedByDefault } = this.props;

    if (selectedByDefault) {
      this.textInput.focus();
    }
  }

  // onFocus() {
  // }

  onBlur() {
    if (!this || !this.textInput) return;
    const {
      alwaysSelected,
    } = this.props;

    if (alwaysSelected) {
      this.textInput.focus();
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;
    const { value } = e.target;
    onChange(value);
  }

  render() {
    const {
      type, placeholder, value,
    } = this.props;
    return (
      <div className="FormInput-Component">
        <input
          type={type}
          className="form-control"
          placeholder={placeholder}
          onChange={this.onChange}
          value={value}
          ref={elem => { this.textInput = elem; }}
          // onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

export default FormInput;
