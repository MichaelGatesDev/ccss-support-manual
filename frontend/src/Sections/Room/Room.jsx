
import React, { Component, Fragment } from 'react';
import './Room.css';

import NavBar from "../../Components/NavBar/NavBar";
import ImageCarousel from "../../Components/ImageCarousel/ImageCarousel";


class Room extends Component {

    constructor(props) {
        super(props);

        this.state = {
            building: null,
            room: null,
            loading: true
        };
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
                console.log("Failed to fetch room images");
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
                console.log("Failed to fetch room images");
            });
    }

    fetchImages() {
        fetch('/api/v1/images/' + this.state.room.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    loading: false,
                    mainImages: data.mainImages,
                    panoramicImages: data.panoramicImages,
                    equipmentImages: data.equipmentImages
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room images");
            });
    }

    onSearch(value) {
        this.setState({
            filterSearch: value
        });
    }


    getParentBuilding(roomObj) {
        for (const building of this.state.buildings) {
            for (const room of building.rooms) {
                if (room.id === roomObj.id) return building;
            }
        }
        return null;
    }

    getTitle() {
        return this.state.building.officialName + " " + this.state.room.number;
    }

    render() {

        if (this.state.loading) {
            // return splashscreen
            return <p>Loading...</p>
        }


        return (
            <Fragment>
                <NavBar
                    title="CCSS Support Manual"
                    searchable={false}
                />
                <section className="container" id="room-section">

                    <h2>{this.getTitle()}</h2>
                    <h3>{this.state.room.name}</h3>

                    <hr />

                    {this.state.panoramicImages.length > 0 &&
                        <ImageCarousel
                            images={this.state.panoramicImages}
                            height={"250px"}
                            id="panoramas-carousel"
                        />
                    }

                    <hr />

                    <div className="row">
                        <div className="col-lg-4">
                            <ImageCarousel
                                images={this.state.mainImages}
                                height={"350px"}
                                id="main-carousel"
                            />
                        </div>
                        <div className="col-lg-4">
                            <p className="detail-header">Type</p>
                            <p className="detail capitalized">{this.state.room.type}</p>
                            <p className="detail-header">Capacity</p>
                            <p className="detail">{this.state.room.capacity === -1 ? "N/A" : this.state.room.capacity}</p>
                            <p className="detail-header">Extension</p>
                            <p className="detail">{this.state.room.extension === -1 ? "N/A" : this.state.room.extension}</p>
                            <p className="detail-header">Furniture Type</p>
                            <p className="detail capitalized">{this.state.room.furnitureType}</p>
                            <p className="detail-header">Chair Count</p>
                            <p className="detail">{this.state.room.chairCount}</p>
                            <p className="detail-header">Table Count</p>
                            <p className="detail">{this.state.room.tableCount}</p>
                        </div>
                        <div className="col-lg-4">

                            {/* <p className="detail-header">Has Screen</p>
                            <p className="detail">{this.state.room.hasScreen.toString()}</p> */}

                            {this.state.room.hasProjector &&
                                <Fragment>
                                    <p className="detail-header">Audio Requires Projector</p>
                                    <p className="detail capitalized">{this.state.room.audioRequiresProjector.toString()}</p>
                                </Fragment>
                            }

                            {this.state.room.hasTeachingStationComputer &&
                                <Fragment>
                                    <p className="detail-header">Teaching Station Computer Type</p>
                                    <p className="detail capitalized">{this.state.room.teachingStationComputerType}</p>
                                    <p className="detail-header">Teaching Station Operating System</p>
                                    <p className="detail uppercase">{this.state.room.teachingStationComputerOS}</p>
                                </Fragment>
                            }

                            {/* <p className="detail-header">Has Document Camera</p>
                            <p className="detail">{this.state.room.hasDocCam.toString()}</p> */}

                            {this.state.room.hasDVDPlayer &&
                                <Fragment>
                                    <p className="detail-header">DVD Player Type</p>
                                    <p className="detail uppercase">{this.state.room.dvdPlayerType}</p>
                                </Fragment>
                            }

                            {this.state.room.hasPrinter &&
                                <Fragment>
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
                                </Fragment>
                            }

                        </div>
                    </div>

                    <hr />

                    <p>Troubleshooting stuff goes here..</p>

                    <hr />

                    <p>ID: {this.state.room.id}</p>
                    <p>Last Updated: {this.state.room.lastChecked}</p>

                </section>
            </Fragment>
        );
    }
}

export default Room;
