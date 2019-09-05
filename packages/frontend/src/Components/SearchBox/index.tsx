import React, { Component } from "react";

import "./style.scss";

import FormInput from "../FormInput";

interface Props {
  onChange: Function;
  label: string;
  value: string;
  buttonText: string;
}

interface State {
}

class SearchBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
  }


  resetFilters() {
    const { onChange } = this.props;
    onChange("");
  }

  render() {
    const {
      onChange, label, value, buttonText,
    } = this.props;
    return (
      <div className="SearchBox-Component">
        <div className="text-center">
          <h5>{label}</h5>
          <hr />
          <FormInput
            type="text"
            placeholder="Search by title"
            onChange={onChange}
            value={value}
          />
          <button className="btn btn-primary w-100" onClick={this.resetFilters} type="button">{buttonText}</button>
        </div>
      </div>
    );
  }
}

export default SearchBox;
