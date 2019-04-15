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

        if (this.props.selectedByDefault) {
            this.textInput.focus();
        }

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus() {

    }

    onBlur() {
        if (this.props.alwaysSelected) {
            this.textInput.focus();
        }
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
                    ref={elem => (this.textInput = elem)}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            </div>
        );
    }
}

export default FormInput;
