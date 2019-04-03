import React, { Component, Fragment } from 'react';
import './SearchBox.scss';

import FormInput from "../../Components/FormInput/FormInput";

var _ = require('underscore');

class SearchBox extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }


    resetFilters() {
        this.setState({
            activeFilters: this.props.enabledByDefault ? this.props.keys : []
        }, function () {
            this.props.onChange(this.state.activeFilters);
        });
    }

    render() {
        return (
            <div className="SearchBox-Component">
                <div className="text-center">
                    <h5>{this.props.label}</h5>
                    <hr />
                    <FormInput
                        type="text"
                        placeholder="Search by title"
                        onChange={this.props.onChange}
                        value={this.props.searchQuery}
                    />
                    <button className="btn btn-primary w-100" onClick={this.resetFilters}>{this.props.buttonText}</button>
                </div>
            </div>
        );
    }
}

export default SearchBox;
