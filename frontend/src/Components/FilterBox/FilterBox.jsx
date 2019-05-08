import React, { Component, Fragment } from 'react';
import './FilterBox.scss';

import Filter from './Filter/Filter';

import _ from 'underscore';

class FilterBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeFilters: []
        };

        this.onFilterChange = this.onFilterChange.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
    }

    componentDidMount() {
        this.resetFilters();
    }

    resetFilters() {
        this.setState({
            activeFilters: this.props.enabledByDefault ? this.props.keys : []
        }, function () {
            this.props.onChange(this.state.activeFilters);
        });
    }

    onFilterChange(name, becomeActive) {
        this.setState({
            activeFilters: becomeActive ? [...this.state.activeFilters, name] : this.state.activeFilters.filter(item => item !== name)
        }, function () {
            this.props.onChange(this.state.activeFilters);
        });
    }

    render() {

        var sortedKeys = _.sortBy(this.props.keys, function (obj) { return obj; });

        var filters = sortedKeys.map(function (value, index) {
            var selected = this.state.activeFilters.includes(value);
            return (
                <Filter
                    name={value}
                    key={index}
                    onChange={this.onFilterChange}
                    selected={selected}
                />
            );
        }, this);

        return (
            <div className="FilterBox-Component">
                <div className="text-center">
                    <h5>{this.props.label}</h5>
                    <hr />
                    {
                        filters.length > 0 ?
                            <Fragment>
                                <div className="col">
                                    {filters}
                                </div>
                                <button className="btn btn-primary w-100" onClick={this.resetFilters}>{this.props.buttonText}</button>
                            </Fragment>
                            :
                            <p>There are no options to filter.</p>
                    }
                </div>
            </div>
        );
    }
}

export default FilterBox;
