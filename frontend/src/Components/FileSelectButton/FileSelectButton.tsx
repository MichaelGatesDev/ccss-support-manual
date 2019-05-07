import * as React from 'react';
import { Component } from 'react';

import './FileSelectButton.scss';

interface Props {
    title: string;
    name: string;
}

interface State {
}

class FileSelectButton extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="FileSelectButton-Component">
                <input
                    type="file"
                    title={this.props.title}
                    accept=".xlsx"
                    name={this.props.name}
                />
            </div>
        );
    }
}

export default FileSelectButton;
