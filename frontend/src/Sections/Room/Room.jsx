import React, { Component, Fragment } from 'react';
import './Room.scss';

import NavBar from "../../Components/NavBar/NavBar";
import ImageCarousel from "../../Components/ImageCarousel/ImageCarousel";
import TroubleshootingFilters from "../../Components/TroubleshootingFilters/TroubleshootingFilters";
import TroubleshootingTips from '../../Components/TroubleshootingTips/TroubleshootingTips';

var _ = require('underscore');

class Room extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            activeTroubleshootingTypeFilters: [],
            activeTroubleshootingTagFilters: []
        };

        this.updateTroubleshootingFilters = this.updateTroubleshootingFilters.bind(this);
    }

    componentDidMount() {
        this.fetchRoom();
    }


    fetchRoom() {
        fetch('/api/v1/rooms/' + this.props.match.params.roomID)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    room: data
                }, function () {
                    this.fetchBuilding();
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room");
            });
    }

    fetchBuilding() {
        fetch('/api/v1/getbuilding?roomID=' + this.props.match.params.roomID)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    building: data
                }, function () {
                    this.fetchImages();
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room building");
            });
    }

    fetchImages() {
        fetch('/api/v1/images/' + this.state.room.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    mainImages: data.mainImages,
                    panoramicImages: data.panoramicImages,
                    equipmentImages: data.equipmentImages
                }, function () {
                    this.fetchTroubleshootingData()
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room images");
            });
    }

    fetchTroubleshootingData() {
        fetch('/api/v1/troubleshooting-data/' + this.state.room.id)
            .then(response => response.json())
            .then(data => {

                var sortedData = _.sortBy(data, function (item) {
                    return item.types;
                });

                this.setState({
                    loading: false,
                    troubleshootingData: sortedData
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room troubleshooting data");
            });
    }

    updateTroubleshootingFilters(filters) {
        this.setState({
            activeTroubleshootingTypeFilters: filters
        });
    }

    getTitle() {
        return this.state.building.officialName + " " + this.state.room.number;
    }

    render() {

        if (this.state.loading) {
            // TODO render splashscreen
            return <p>Loading...</p>
        }


        return (
            <Fragment>
                <NavBar
                    title="CCSS Support Manual"
                    searchable={false}
                />
                <section className="container" id="room-section">

                    <div className="row">
                        <div className="col">
                            <h2 className="room-title capitalized">{this.getTitle()}</h2>
                        </div>
                    </div>

                    {this.state.room.name &&
                        <div className="row">
                            <div className="col">
                                <h3>{this.state.room.name}</h3>
                            </div>
                        </div>
                    }


                    <div className="general-room-info">
                        <div className="row">
                            <div className="col-4 text-center">
                                <h4>Room Type</h4>
                            </div>
                            <div className="col-4 text-center">
                                <h4>Room Capacity</h4>
                            </div>
                            <div className="col-4 text-center">
                                <h4>Room Extension</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 text-center">
                                <p className="capitalized">{this.state.room.type}</p>
                            </div>
                            <div className="col-4 text-center">
                                <p>{parseInt(this.state.room.capacity) === -1 ? 'N/A' : this.state.room.capacity}</p>
                            </div>
                            <div className="col-4 text-center">
                                <p>{parseInt(this.state.room.extension) === -1 ? 'N/A' : this.state.room.extension}</p>
                            </div>
                        </div>
                    </div>

                    {this.state.panoramicImages.length > 0 &&
                        <Fragment>
                            <div className="row panoramas">
                                <div className="col">
                                    <ImageCarousel
                                        images={this.state.panoramicImages}
                                        height={"250px"}
                                        id="panoramas-carousel"
                                    />
                                </div>
                            </div>
                        </Fragment>
                    }

                    <div className="row">
                        <div className="col-lg-4">
                            <ImageCarousel
                                images={this.state.mainImages}
                                height={"350px"}
                                id="main-carousel"
                            />
                        </div>
                        <div className="col-lg-4">
                            <h5>Furniture</h5>
                            <hr />
                            <p className="detail-header">Furniture Type</p>
                            <p className="detail capitalized">{this.state.room.furnitureType}</p>
                            <p className="detail-header">Chair Count</p>
                            <p className="detail">{this.state.room.chairCount}</p>
                            <p className="detail-header">Table Count</p>
                            <p className="detail">{this.state.room.tableCount}</p>
                        </div>

                        <div className="col-lg-4">
                            <h5>Technology</h5>
                            <hr />

                            {/* <p className="detail-header">Has Screen</p>
                            <p className="detail">{this.state.room.hasScreen.toString()}</p> */}

                            <Fragment>
                                <p className="detail-header" data-toggle="collapse" data-target="#collapse-audio" aria-expanded="false" aria-controls="collapse-audio">
                                    Audio
                                </p>
                                <div className="collapse" id="collapse-audio">
                                    <p>Section TBD</p>
                                </div>
                            </Fragment>

                            {this.state.room.hasProjector &&
                                <Fragment>
                                    <p className="detail-header" data-toggle="collapse" data-target="#collapse-projector" aria-expanded="false" aria-controls="collapse-projector">
                                        Projector
                                    </p>
                                    <div className="collapse" id="collapse-projector">
                                        <p>Section TBD</p>
                                    </div>
                                </Fragment>
                            }

                            {this.state.room.hasTeachingStationComputer &&
                                <Fragment>
                                    <p className="detail-header" data-toggle="collapse" data-target="#collapse-computer" aria-expanded="false" aria-controls="collapse-computer">
                                        Teaching Station Computer
                                    </p>
                                    <div className="collapse" id="collapse-computer">
                                        <p className="detail-header">Computer Type</p>
                                        <p className="detail capitalized">{this.state.room.teachingStationComputerType}</p>
                                        <p className="detail-header">Operating System</p>
                                        <p className="detail uppercase">{this.state.room.teachingStationComputerOS}</p>
                                    </div>
                                </Fragment>
                            }

                            {/* <p className="detail-header">Has Document Camera</p>
                            <p className="detail">{this.state.room.hasDocCam.toString()}</p> */}

                            {this.state.room.hasDVDPlayer &&
                                <Fragment>
                                    <p className="detail-header" data-toggle="collapse" data-target="#collapse-dvd-player" aria-expanded="false" aria-controls="collapse-dvd-player">
                                        DVD Player
                                    </p>
                                    <div className="collapse" id="collapse-dvd-player">
                                        <p className="detail-header">DVD Player Type</p>
                                        <p className="detail uppercase">{this.state.room.dvdPlayerType}</p>
                                    </div>
                                </Fragment>
                            }

                            {this.state.room.hasPrinter &&
                                <Fragment>

                                    <p className="detail-header" data-toggle="collapse" data-target="#collapse-printer" aria-expanded="false" aria-controls="collapse-printer">
                                        Printer
                                    </p>
                                    <div className="collapse" id="collapse-printer">

                                        {this.state.room.printerSymquestNumber &&
                                            <Fragment>
                                                <p className="detail-header">Printer Symquest Number</p>
                                                <p className="detail uppercase">{this.state.room.printerSymquestNumber}</p>
                                            </Fragment>
                                        }
                                        {this.state.room.printerCartridgeType &&
                                            <Fragment>
                                                <p className="detail-header">Printer Cartridge Type</p>
                                                <p className="detail uppercase">{this.state.room.printerCartridgeType}</p>
                                            </Fragment>
                                        }
                                    </div>
                                </Fragment>
                            }

                        </div>
                    </div>

                    <hr />

                    {/* Troubleshooting stuff begins here */}
                    <div className="row">
                        <div className="col-sm-2">
                            <TroubleshootingFilters
                                troubleshootingData={this.state.troubleshootingData}
                                onChange={this.updateTroubleshootingFilters}
                            />
                        </div>
                        <div className="col">
                            <TroubleshootingTips
                                troubleshootingData={this.state.troubleshootingData}
                                typeFilters={this.state.activeTroubleshootingTypeFilters}
                                tagFilters={this.state.activeTroubleshootingTagFilters}
                            />
                        </div>
                    </div>

                    <hr />

                    <p>ID: {this.state.room.id}</p>
                    <p>Last Updated: {this.state.room.lastChecked}</p>

                </section>
            </Fragment>
        );
    }
}

export default Room;
