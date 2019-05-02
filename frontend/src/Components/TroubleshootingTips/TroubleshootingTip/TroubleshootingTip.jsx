import React, { Component } from 'react';
import './TroubleshootingTip.scss';

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
                <p className="types">
                    {
                        this.props.data.types.length > 0 ?
                            this.props.data.types.join(", ")
                            :
                            "N/A"
                    }
                </p>
                <p className="tags">
                    {
                        this.props.data.tags.length > 0 ?
                            this.props.data.tags.join(", ")
                            :
                            "N/A"
                    }
                </p>
            </div>
        );
    }
}

export default TroubleshootingTip;
