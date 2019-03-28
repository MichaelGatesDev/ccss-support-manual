import React, { Component } from 'react';
import './TroubleshootingFilters.css';

import Checkbox from '../Checkbox/Checkbox';

var _ = require('underscore');

class TroubleshootingFilters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTypeFilters: []
        };

        this.onFilterChange = this.onFilterChange.bind(this);
    }

    removeFromArray(array, value) {
        return array.filter(function (ele) {
            return ele !== value;
        });
    }


    componentDidMount() {
        this.setState({
            activeTypeFilters: this.getAllTypes()
        }, function () {
            this.props.onChange(this.state.activeTypeFilters);
        });
    }

    getAllTypes() {
        let results = [];
        for (const td of this.props.troubleshootingData) {
            for (const type of td.types) {
                if (!results.includes(type.toLowerCase()))
                    results.push(type);
            }
        }
        return _.sortBy(results, function (obj) { return obj; }); // sort alphabetically descending (A-Z)
    }

    onFilterChange(filterName, checked) {
        var newFilters = this.state.activeTypeFilters;
        if (checked && !newFilters.includes(filterName))
            newFilters.push(filterName);
        else if (!checked && newFilters.includes(filterName))
            newFilters = this.removeFromArray(newFilters, filterName);

        this.setState({
            activeTypeFilters: newFilters
        }, function () {
            this.props.onChange(newFilters);
        });

    }

    render() {

        var checkboxes = this.getAllTypes().map(function (value, index) {
            return (
                <Checkbox
                    name={value}
                    text={value}
                    checked={true}
                    key={index}
                    id={"filter-checkbox-" + value}
                    onChange={this.onFilterChange}
                />
            );
        }, this);

        return (
            <div className="TroubleshootingFilters-Component">
                <div className="center">
                    <h5>Filters</h5>
                    <hr />
                    <div className="right">
                        {checkboxes}
                    </div>
                </div>
            </div>
        );
    }
}

export default TroubleshootingFilters;
