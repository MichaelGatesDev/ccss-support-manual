import React, { Component } from 'react';
import './FileSelectButton.css';

class FileSelectButton extends Component {

    constructor(props) {
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
                    text={this.props.title}
                    accept=".xlsx"
                    name={this.props.name}
                />
            </div>
        );
    }
}

export default FileSelectButton;
