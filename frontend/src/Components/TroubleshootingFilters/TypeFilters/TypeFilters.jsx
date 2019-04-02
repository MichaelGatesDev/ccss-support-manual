import React, { Component, Fragment } from 'react';
import './TypeFilters.scss';

import TypeFilter from '../TypeFilter/TypeFilter';

var _ = require('underscore');

class TypeFilters extends Component {

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
            activeFilters: []
        }, function () {
            this.setState({
                activeFilters: this.props.types
            }, function () {
                console.log("Reset type filters");
                this.props.onChange(this.state.activeFilters);
            });
        });
    }

    onFilterChange(name, selected) {
        if (selected && !this.state.activeFilters.includes(name)) {
            this.setState({
                activeFilters: [...this.state.activeFilters, name]
            }, function () {
                this.props.onChange(this.state.activeFilters);
            });
        }
        else if (!selected && this.state.activeFilters.includes(name)) {
            this.setState({
                activeFilters: this.removeFromArray(this.state.activeFilters, name)
            }, function () {
                this.props.onChange(this.state.activeFilters);
            });
        }
    }

    isSelected(name) {
        return this.state.activeFilters.includes(name);
    }

    removeFromArray(array, value) {
        return array.filter(function (ele) {
            return ele !== value;
        });
    }

    render() {

        var sortedTypes = _.sortBy(this.props.types, function (type) { return type; });

        var typeFilters = sortedTypes.map(function (value, index) {

            var selected = this.isSelected(value);

            return (
                <TypeFilter
                    name={value}
                    key={index}
                    onChange={this.onFilterChange}
                    selected={selected}
                />
            );
        }, this);

        return (
            <div className="TypeFilters-Component">
                <div className="text-center">
                    <h5>Type Filters</h5>
                    <hr />
                    {typeFilters.length > 0 ?
                        <Fragment>
                            <div className="col">
                                {typeFilters}
                            </div>
                            <hr />
                            <button className="btn btn-primary w-100" onClick={this.resetFilters}>Reset Filters</button>
                        </Fragment>
                        :
                        <p>There are no types to filter.</p>
                    }
                </div>
            </div>
        );
    }
}

export default TypeFilters;
