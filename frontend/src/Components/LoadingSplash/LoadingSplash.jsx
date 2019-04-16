import React, { Component } from 'react';
import './LoadingSplash.scss';

class LoadingSplash extends Component {

    constructor(props) {
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
