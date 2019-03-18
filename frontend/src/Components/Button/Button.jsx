import React, { Component } from 'react';
import './Button.css';

class Button extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
    }

    onClick(e) {
        if (this.props.preventDefault) {
            e.preventDefault();
        }
    }

    render() {
        return (
            <div className="Button-Component">
                <input type="button"
                    value={this.props.title}
                    onClick={this.onClick}
                />
            </div>
        );
    }
}

export default Button;
