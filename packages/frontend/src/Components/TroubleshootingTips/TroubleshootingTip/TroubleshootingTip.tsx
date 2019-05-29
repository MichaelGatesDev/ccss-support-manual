import * as React from 'react';
import { Component } from 'react';

import './TroubleshootingTip.scss';

interface Props {
    data: any;
}

interface State {

}

class TroubleshootingTip extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

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
