import * as React from 'react';
import { Component } from 'react';

import './SearchBox.scss';

import FormInput from "../FormInput/FormInput";

interface Props {
    onChange: any;
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
