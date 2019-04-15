import React, { Component } from 'react';
import './SearchBox.scss';

import FormInput from "../../Components/FormInput/FormInput";

class SearchBox extends Component {

    constructor(props) {
        super(props);

        this.resetFilters = this.resetFilters.bind(this);
    }

    componentDidMount() {
    }


    resetFilters() {
        this.props.onChange('');
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
                        value={this.props.value}
                    />
                    <button className="btn btn-primary w-100" onClick={this.resetFilters}>{this.props.buttonText}</button>
                </div>
            </div>
        );
    }
}

export default SearchBox;
