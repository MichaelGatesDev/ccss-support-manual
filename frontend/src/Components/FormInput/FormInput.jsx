import React, { Component } from 'react';
import './FormInput.css';

class FormInput extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.setState({
        });
    }

    onChange(e) {
        let value = e.target.value;
        this.props.onChange(value);
    }

    render() {
        return (
            <div className="FormInput-Component">
                <input
                    type={this.props.type}
                    className="form-control"
                    placeholder={this.props.placeholder}
                    onChange={this.onChange}
                    value={this.props.value}
                />
            </div>
        );
    }
}

export default FormInput;
