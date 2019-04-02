import React, { Component } from 'react';
import './TypeFilter.scss';

var _ = require('underscore');

class TypeFilters extends Component {

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
    }

    onSelect(e) {
        this.props.onChange(this.props.name, !this.props.selected);
    }

    render() {
        return (
            <div className="TypeFilter-Component row" onClick={this.onSelect}>
                <div className="col capitalized">{this.props.name}</div>
                <div className="col-mr">
                    <input type="checkbox"
                        checked={this.props.selected}
                        readOnly
                    />
                </div>
            </div>
        );
    }
}

export default TypeFilters;
