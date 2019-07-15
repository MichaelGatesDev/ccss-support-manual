import * as React from 'react';
import { Component, Fragment } from 'react';

import './Room.scss';

import NavBar from "../../Components/NavBar/NavBar";
import ImageCarousel from "../../Components/ImageCarousel/ImageCarousel";
import FilterBox from "../../Components/FilterBox/FilterBox";
import TroubleshootingTips from '../../Components/TroubleshootingTips/TroubleshootingTips';
import SearchBox from '../../Components/SearchBox/SearchBox';
import LoadingSplash from '../../Components/LoadingSplash/LoadingSplash';

import GeneralInfo from './GeneralInfo/GeneralInfo';

import _ from 'lodash';

interface Props {
    match: any;
}

interface State {
    loading: boolean;
    activeTroubleshootingTypeFilters: string[];
    activeTroubleshootingTagFilters: string[];
    activeSearchQuery: string;

    images?: any;
    room?: any;
    building?: any;
    troubleshootingData?: any;
}

class Room extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            images: undefined,
            activeTroubleshootingTypeFilters: [],
            activeTroubleshootingTagFilters: [],
            activeSearchQuery: ''
        };

        this.onTypeFilterChange = this.onTypeFilterChange.bind(this);
        this.onTagFilterChange = this.onTagFilterChange.bind(this);
        this.onFilterSearch = this.onFilterSearch.bind(this);
    }

    componentDidMount() {
        this.fetchRoom();
    }

    fetchRoom() {
        let self = this;
        fetch('/api/v1/buildings/' + this.props.match.params.buildingName + "/rooms/" + this.props.match.params.roomNumber)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    room: data
                }, function () {
                    self.fetchBuilding();
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room");
            });
    }

    fetchBuilding() {
        let self = this;
        fetch('/api/v1/buildings/' + this.props.match.params.buildingName)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    building: data
                }, function () {
                    self.fetchImages();
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room building");
            });
    }

    fetchImages() {
        let self = this;
        fetch('/api/v1/images/buildings/' + this.props.match.params.buildingName + "/rooms/" + this.props.match.params.roomNumber)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    images: data
                }, function () {
                    self.fetchTroubleshootingData()
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room images");
            });
    }

    fetchTroubleshootingData() {
        fetch('/api/v1/troubleshooting-data/buildings/' + this.props.match.params.buildingName + "/rooms/" + this.props.match.params.roomNumber)
            .then(response => response.json())
            .then(data => {
                const sortedTypes = _.sortBy(data, function (item: any) { return item.types; });
                this.setState({
                    loading: false,
                    troubleshootingData: sortedTypes
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room troubleshooting data");
            });
    }

    getTitle() {
        return this.state.building.officialName + " " + this.state.room.number;
    }

    getAllTroubleshootingDataTypes() {
        let results: any[] = [];
        for (const td of this.state.troubleshootingData) {
            for (const type of td.types) {
                if (!results.includes(type.toLowerCase()))
                    results.push(type.toLowerCase());
            }
        }
        return _.sortBy(results); // sort alphabetically descending (A-Z)
    }

    getAllTroubleshootingDataTags() {
        let results: any[] = [];
        for (const td of this.state.troubleshootingData) {
            for (const tag of td.tags) {
                if (!results.includes(tag.toLowerCase()))
                    results.push(tag.toLowerCase());
            }
        }
        return _.sortBy(results); // sort alphabetically descending (A-Z)
    }

    onTypeFilterChange(activeTypeFilters: string[]) {
        this.setState({
            activeTroubleshootingTypeFilters: activeTypeFilters
        });
    }

    onTagFilterChange(activeTagFilters: string[]) {
        this.setState({
            activeTroubleshootingTagFilters: activeTagFilters
        });
    }

    onFilterSearch(query: string) {
        this.setState({
            activeSearchQuery: query
        });
    }

    imagesAsArray(imagesObject: any) {
        let result = [];
        for (const item of imagesObject) {
            result.push(item.url);
        }
        return result;
    }

    render() {

        return (

            <Fragment>
                {this.state.loading &&
                    <LoadingSplash />
                }
                {!this.state.loading &&
                    <Fragment>
                        <NavBar
                            title="CCSS Support Manual"
                            searchable={false}
                        />
                        <section className="container" id="room-section">

                            <GeneralInfo
                                title={this.getTitle()}
                                room={this.state.room}
                            />

                            {this.state.images.panoramicImages.length > 0 &&
                                <Fragment>
                                    <div className="row panoramas">
                                        <div className="col">
                                            <ImageCarousel
                                                images={this.imagesAsArray(this.state.images.panoramicImages)}
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
                                        images={this.imagesAsArray(this.state.images.rootImages)}
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
                                        <p className="detail-header">
                                            Audio
                                </p>
                                        <span>
                                            {this.state.room.audioRequiresProjector ?
                                                <i
                                                    className="fas fa-volume-up"
                                                    style={{ color: 'orange' }}
                                                    data-toggle="tooltip"
                                                    title="Audio requires projector"
                                                />
                                                :
                                                <i
                                                    className="fas fa-volume-up"
                                                    style={{ color: 'gray' }}
                                                    data-toggle="tooltip"
                                                    title="Audio does not require projector"
                                                />
                                            }
                                        </span>
                                    </Fragment>

                                    {/* {this.state.room.hasProjector &&
                                <Fragment>
                                    <p className="detail-header" data-toggle="collapse" data-target="#collapse-projector" aria-expanded="false" aria-controls="collapse-projector">
                                        Projector
                                    </p>
                                    <div className="collapse" id="collapse-projector">
                                        <p>Section TBD</p>
                                    </div>
                                </Fragment>
                            } */}

                                    {this.state.room.hasTeachingStationComputer &&
                                        <Fragment>
                                            <p className="detail-header">
                                                Teaching Station Computer
                                    </p>

                                            {/* Computer Type */}
                                            <span>
                                                {this.state.room.teachingStationComputerType === 'all-in-one' &&
                                                    <i
                                                        className="fas fa-desktop"
                                                        data-toggle="tooltip"
                                                        title="All-In-One"
                                                    />
                                                }
                                                {this.state.room.teachingStationComputerType === 'tower' &&
                                                    <i
                                                        className="fas fa-server"
                                                        data-toggle="tooltip"
                                                        title={this.state.room.teachingStationComputerType}
                                                    />
                                                }
                                                {this.state.room.teachingStationComputerType === 'mini-pc' &&
                                                    <i
                                                        className="fas fa-hdd"
                                                        data-toggle="tooltip"
                                                        title={this.state.room.teachingStationComputerType}
                                                    />
                                                }
                                                {this.state.room.teachingStationComputerType === 'imac' &&
                                                    <i
                                                        className="fas fa-tv"
                                                        data-toggle="tooltip"
                                                        title={this.state.room.teachingStationComputerType}
                                                    />
                                                }
                                                {this.state.room.teachingStationComputerType === 'laptop' &&
                                                    <i
                                                        className="fas fa-laptop"
                                                        data-toggle="tooltip"
                                                        title={this.state.room.teachingStationComputerType}
                                                    />
                                                }
                                            </span>

                                            {/* Operating System */}
                                            <span>
                                                {this.state.room.teachingStationComputerOS.includes('windows') &&
                                                    <i
                                                        className="fab fa-windows"
                                                        data-toggle="tooltip"
                                                        title={this.state.room.teachingStationComputerOS}
                                                    />
                                                }
                                                {this.state.room.teachingStationComputerOS === 'osx' &&
                                                    <i
                                                        className="fab fa-apple"
                                                        data-toggle="tooltip"
                                                        title={this.state.room.teachingStationComputerOS}
                                                    />
                                                }
                                                {this.state.room.teachingStationComputerOS.includes('linux') &&
                                                    <i className="fab fa-linux" />
                                                }
                                            </span>
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
                                <div className="col-sm-3">
                                    <SearchBox
                                        label={"Search"}
                                        buttonText={"Clear"}
                                        onChange={this.onFilterSearch}
                                        value={this.state.activeSearchQuery}
                                    />
                                    <FilterBox
                                        label={"Type Filters"}
                                        keys={this.getAllTroubleshootingDataTypes()}
                                        buttonText={"Reset"}
                                        onChange={this.onTypeFilterChange}
                                        enabledByDefault={true}
                                    />
                                    <FilterBox
                                        label={"Tag Filters"}
                                        keys={this.getAllTroubleshootingDataTags()}
                                        buttonText={"Reset"}
                                        onChange={this.onTagFilterChange}
                                        enabledByDefault={false}
                                    />
                                </div>
                                <div className="col">
                                    <TroubleshootingTips
                                        troubleshootingData={this.state.troubleshootingData}
                                        typeFilters={this.state.activeTroubleshootingTypeFilters}
                                        tagFilters={this.state.activeTroubleshootingTagFilters}
                                        search={this.state.activeSearchQuery}
                                    />
                                </div>
                            </div>

                            <hr />

                            <p>Last Updated: {this.state.room.lastChecked}</p>

                        </section>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

export default Room;