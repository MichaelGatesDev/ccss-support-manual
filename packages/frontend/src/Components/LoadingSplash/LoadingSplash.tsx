import * as React from 'react';
import { Component } from 'react';

import './LoadingSplash.scss';

interface Props { }
interface State { }

class LoadingSplash extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="LoadingSplash-Component">
                <p className="text">Loading... </p>
                <p className="loading-icon-container">
                    <i className="fas fa-spinner loading-icon"></i>
                </p>
            </div>
        );
    }
}

export default LoadingSplash;
