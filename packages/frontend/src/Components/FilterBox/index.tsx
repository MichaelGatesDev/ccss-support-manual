import "./style.scss";

import React, { Component, Fragment } from "react";
import _ from "lodash";
import shortid from "shortid";

import Filter from "./Filter";


interface Props {
  onChange: Function;
  enabledByDefault: boolean;
  keys: string[];
  label: string;
  buttonText: string;
}

interface State {
  activeFilters: string[];
}

class FilterBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeFilters: [],
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.resetFilters();
  }

  onFilterChange(name: string, becomeActive: boolean) {
    const { onChange } = this.props;
    const { activeFilters } = this.state;
    this.setState({
      activeFilters: becomeActive ? [...activeFilters, name] : activeFilters.filter(item => item !== name),
    }, () => {
      onChange(activeFilters);
    });
  }

  resetFilters() {
    const { enabledByDefault, keys, onChange } = this.props;
    const { activeFilters } = this.state;
    this.setState({
      activeFilters: enabledByDefault ? keys : [],
    }, () => {
      onChange(activeFilters);
    });
  }

  render() {
    const { activeFilters } = this.state;
    const { keys, label, buttonText } = this.props;

    const sortedKeys = _.sortBy(keys);

    const filters = sortedKeys.map((value: string) => {
      const selected = activeFilters.includes(value);
      return (
        <Filter
          name={value}
          key={shortid.generate()}
          onChange={this.onFilterChange}
          selected={selected}
        />
      );
    }, this);

    return (
      <div className="FilterBox-Component">
        <div className="text-center">
          <h5>{label}</h5>
          <hr />
          {
            filters.length > 0 ?
              (
                <Fragment>
                  <div className="col">
                    {filters}
                  </div>
                  <button className="btn btn-primary w-100" onClick={this.resetFilters} type="button">{buttonText}</button>
                </Fragment>
              )
              :
              (
                <p>
                  There are no options to filter.
                </p>
              )
          }
        </div>
      </div>
    );
  }
}

export default FilterBox;
