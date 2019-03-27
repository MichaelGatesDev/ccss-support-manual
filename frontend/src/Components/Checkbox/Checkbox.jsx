import React, { Component } from 'react';
import './Checkbox.css';

class Checkbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: true
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
    }

    onChange(e) {
        this.setState({
            checked: e.target.checked
        }, function () {
            this.props.onChange(this.props.name, this.state.checked);
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
