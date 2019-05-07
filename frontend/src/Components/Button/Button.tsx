import * as React from 'react';
import { Component } from 'react';

import './Button.scss';

interface Props {
    preventDefault: boolean;
    title: string;
}

interface State {
}

class Button extends Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.state = {
        };

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
    }

    onClick(e: React.MouseEvent<HTMLInputElement>) {
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
