import * as React from 'react';
import { Component, Fragment } from 'react';

import './FilterBox.scss';

import Filter from './Filter/Filter';

var _ = require('underscore');

interface Props {
    onChange: any;
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
            activeFilters: []
        };

        this.onFilterChange = this.onFilterChange.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
    }

    componentDidMount() {
        this.resetFilters();
    }

    resetFilters() {
        let self = this;
        this.setState({
            activeFilters: self.props.enabledByDefault ? self.props.keys : []
        }, function () {
            self.props.onChange(self.state.activeFilters);
        });
    }

    onFilterChange(name: string, becomeActive: boolean) {
        let self = this;
        this.setState({
            activeFilters: becomeActive ? [...self.state.activeFilters, name] : self.state.activeFilters.filter(item => item !== name)
        }, function () {
            self.props.onChange(self.state.activeFilters);
        });
    }

    render() {
        let self = this;

        var sortedKeys = _.sortBy(this.props.keys, function (obj: any) { return obj; });

        var filters = sortedKeys.map(function (value: string, index: number) {
            var selected = self.state.activeFilters.includes(value);
            return (
                <Filter
                    name={value}
                    key={index}
                    onChange={self.onFilterChange}
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
