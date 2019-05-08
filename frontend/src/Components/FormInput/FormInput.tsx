import * as React from 'react';
import { Component } from 'react';

import './FormInput.scss';

interface Props {
    selectedByDefault?: boolean;
    alwaysSelected?: boolean;
    onChange: any;
    placeholder: string;
    type: string;
    value: string;
}

interface State {

}

class FormInput extends Component<Props, State> {

    textInput: HTMLInputElement | undefined | null;

    constructor(props: Props) {
        super(props);

        this.state = {
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (!this || !this.textInput) return;

        if (this.props.selectedByDefault) {
            this.textInput.focus();
        }

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus() {

    }

    onBlur() {
        if (!this || !this.textInput) return;

        if (this.props.alwaysSelected) {
            this.textInput.focus();
        }
    }

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
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
