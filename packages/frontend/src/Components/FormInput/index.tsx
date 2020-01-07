import React, { Component } from "react";

import "./style.scss";

interface Props {
  onChange: (newValue: string) => void;
  placeholder: string;
  value: string;
  name?: string;

  selectedByDefault?: boolean;
  alwaysSelected?: boolean;
}

class FormInput extends Component<Props> {
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
      placeholder, value, name,
    } = this.props;
    return (
      <div className="FormInput-Component">
        <input
          name={name}
          type="text"
          className="form-control"
          placeholder={placeholder}
          onChange={this.onChange}
          value={value}
          ref={(elem) => { this.textInput = elem; }}
          // onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

export default FormInput;
