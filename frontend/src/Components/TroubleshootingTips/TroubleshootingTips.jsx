import React, { Component } from 'react';
import './TroubleshootingTips.css';

import TroubleshootingTip from './TroubleshootingTip/TroubleshootingTip';

// var _ = require('underscore');

class TroubleshootingTips extends Component {

    // constructor(props) {
    //     super(props);
    // }

    // componentDidMount() {
    // }

    render() {

        var data = this.props.troubleshootingData;

        if (this.props.typeFilters && this.props.typeFilters.length > 0) {
            data = data.filter(function (item) {
                for (const typeFilter of this.props.typeFilters)
                    if (item.types.includes(typeFilter))
                        return true;
                return false;
            }, this);
        }

        if (this.props.tagFilters && this.props.tagFilters.length > 0) {
            data = data.filter(function (item) {
                for (const tagFilter of this.props.tagFilters)
                    if (item.tags.includes(tagFilter))
                        return true;
                return false;
            }, this);
        }


        var queries = this.props.search.split(" ");
        for (const q of queries) {
            data = data.filter(function (item) {
                return item.title.includes(q) || item.description.includes(q);
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
                {
                    this.props.typeFilters.length > 0 ?
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
