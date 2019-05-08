import * as React from 'react';
import { Component } from 'react';

import './TroubleshootingTips.scss';

import TroubleshootingTip from './TroubleshootingTip/TroubleshootingTip';

interface Props {
    troubleshootingData: any;
    tagFilters: string[];
    typeFilters: string[];
    search: string;
}

interface State {

}

class TroubleshootingTips extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        let self = this;

        let data = this.props.troubleshootingData;

        data = data.filter(function (item: any) {
            if (item.types.length === 0) return true;
            for (const typeFilter of self.props.typeFilters) {
                if (item.types.includes(typeFilter))
                    return true;
            }
            return false;
        }, this);


        if (this.props.tagFilters.length > 0) {
            data = data.filter(function (item: any) {
                for (const tagFilter of self.props.tagFilters)
                    if (item.tags.includes(tagFilter))
                        return true;
                return false;
            }, this);
        }


        let queries = this.props.search.split(" ");
        for (const q of queries) {
            data = data.filter(function (item: any) {
                return item.title.includes(q) || item.description.includes(q) || item.types.includes(q) || item.tags.includes(q);
            }, this);
        }

        let tips = data.map(function (value: any, index: number) {
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
                    tips.length > 0 ?
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