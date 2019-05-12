import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom'

import './LinkButton.scss';

interface Props {
    href: string;
    title: string;
}

interface State {
}

class LinkButton extends Component<Props, State> {

    constructor(props: Props) {
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
