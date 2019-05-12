import * as React from 'react';
import { Component } from 'react';

import './Filter.scss';

interface Props {
    name: string;
    selected: boolean;
    onChange: any;
}

interface State {
}

class Filter extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
    }

    onSelect() {
        this.props.onChange(this.props.name, !this.props.selected);
    }

    render() {
        return (
            <div className="Filter-Component row" onClick={this.onSelect}>
                <div className="col capitalized">{this.props.name}</div>
                <div className="col-mr">
                    <input type="checkbox"
                        checked={this.props.selected}
                        readOnly
                    />
                </div>
            </div>
        );
    }
}

export default Filter;
