import React, { Component, Fragment } from 'react';
import './GeneralInfo.scss';

class GeneralInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {

        return (
            <Fragment>
                <div className="GeneralInfo-Component">

                    <div className="row">
                        <div className="col">
                            <h2 className="room-title capitalized">{this.props.title}</h2>
                        </div>
                    </div>

                    {this.props.room.name &&
                        <div className="row">
                            <div className="col">
                                <h3>{this.props.room.name}</h3>
                            </div>
                        </div>
                    }

                    <div className="row">

                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col text-center">
                                    <h4>Room Type</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <p className="capitalized">{this.props.room.type}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="row">
                                <div className="col text-center">
                                    <h4>Room Capacity</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <p className="capitalized">{parseInt(this.props.room.capacity) === -1 ? 'N/A' : this.props.room.capacity}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="row">
                                <div className="col text-center">
                                    <h4>Room Extension</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <p className="capitalized">{this.props.room.phone ? this.props.room.phone.extension : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Fragment>
        );
    }
}

export default GeneralInfo;
