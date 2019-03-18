import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './LinkButton.scss';

class LinkButton extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
        });
    }

    render() {
        return (
            <div className="LinkButton-Component">
                <Link to={this.props.href}>{this.props.title}</Link>
            </div>
        );
    }
}

export default LinkButton;
