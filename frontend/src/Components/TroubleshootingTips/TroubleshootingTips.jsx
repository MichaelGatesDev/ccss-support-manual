import React, { Component } from 'react';
import './TroubleshootingTips.css';

import TroubleshootingTip from '../TroubleshootingTip/TroubleshootingTip';

// var _ = require('underscore');

class TroubleshootingTips extends Component {

    // constructor(props) {
    //     super(props);
    // }

    // componentDidMount() {
    // }

    render() {

        var data = this.props.troubleshootingData;

        if (this.props.typeFilters.length > 0) {
            data = data.filter(function (item) {
                for (const typeFilter of this.props.typeFilters)
                    if (item.types.includes(typeFilter))
                        return true;
                return false;
            }, this);
        }

        if (this.props.tagFilters.length > 0) {
            data = data.filter(function (item) {
                for (const tagFilter of this.props.tagFilters)
                    if (item.tags.includes(tagFilter))
                        return true;
                return false;
            }, this);
        }

        var tips = data.map(function (value, index) {
            return (
                <TroubleshootingTip
                    data={value}
                    key={index}
                />
            );
        }, this);

        return (
            <div className="TroubleshootingTips-Component">
                <h5>Troubleshooting Tips</h5>
                <hr />
                {this.props.typeFilters.length > 0 ?
                    <ul>
                        {tips}
                    </ul>
                    :
                    <p>There are no troubleshooting tips that match the filters.</p>
                }
            </div>
        );
    }
}

export default TroubleshootingTips;
