import * as React from 'react';
import { Component } from 'react';

import './Checkbox.scss';

interface Props {
    id: string;
    text: string;
    name: string;

    onChange: any;
}

interface State {
    checked: boolean;
}

class Checkbox extends Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            checked: true
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
    }

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        let self = this;
        this.setState({
            checked: e.target.checked
        }, function () {
            self.props.onChange(self.props.name, self.state.checked);
        });
    }

    render() {
        return (
            <div className="Checkbox-Component">
                <label htmlFor={this.props.id} className={"uppercase"}>{this.props.text}&nbsp;</label>
                <input type="checkbox"
                    id={this.props.id}
                    name={this.props.name}
                    onChange={this.onChange}
                    checked={this.state.checked}
                />
            </div>
        );
    }
}

export default Checkbox;
