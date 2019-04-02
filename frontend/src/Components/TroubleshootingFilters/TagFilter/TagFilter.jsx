import React, { Component } from 'react';
import './TagFilter.scss';

var _ = require('underscore');

class TagFilter extends Component {

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
            <div className="TagFilter-Component row" onClick={this.onSelect}>
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

export default TagFilter;
