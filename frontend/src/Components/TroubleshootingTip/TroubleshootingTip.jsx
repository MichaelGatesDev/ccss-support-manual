import React, { Component } from 'react';
import './TroubleshootingTip.css';

class TroubleshootingTip extends Component {

    // constructor(props) {
    //     super(props);
    // }

    // componentDidMount() {
    // }

    render() {
        return (
            <div className="TroubleshootingTip-Component">
                <p className="title capitalized">{this.props.data.title}</p>
                <p className="description">{this.props.data.description}</p>
                <p className="solution">{this.props.data.solution}</p>
                <p className="types">{this.props.data.types.join(", ")}</p>
                <p className="tags">{this.props.data.tags.join(", ")}</p>
            </div>
        );
    }
}

export default TroubleshootingTip;
