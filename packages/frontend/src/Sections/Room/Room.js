"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
require("./Room.scss");
const NavBar_1 = __importDefault(require("../../Components/NavBar/NavBar"));
const ImageCarousel_1 = __importDefault(require("../../Components/ImageCarousel/ImageCarousel"));
const FilterBox_1 = __importDefault(require("../../Components/FilterBox/FilterBox"));
const TroubleshootingTips_1 = __importDefault(require("../../Components/TroubleshootingTips/TroubleshootingTips"));
const SearchBox_1 = __importDefault(require("../../Components/SearchBox/SearchBox"));
const LoadingSplash_1 = __importDefault(require("../../Components/LoadingSplash/LoadingSplash"));
const GeneralInfo_1 = __importDefault(require("./GeneralInfo/GeneralInfo"));
const lodash_1 = __importDefault(require("lodash"));
class Room extends react_1.Component {
    constructor(props) {
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
                self.fetchTroubleshootingData();
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
            const sortedTypes = lodash_1.default.sortBy(data, function (item) { return item.types; });
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
        let results = [];
        for (const td of this.state.troubleshootingData) {
            for (const type of td.types) {
                if (!results.includes(type.toLowerCase()))
                    results.push(type.toLowerCase());
            }
        }
        return lodash_1.default.sortBy(results); // sort alphabetically descending (A-Z)
    }
    getAllTroubleshootingDataTags() {
        let results = [];
        for (const td of this.state.troubleshootingData) {
            for (const tag of td.tags) {
                if (!results.includes(tag.toLowerCase()))
                    results.push(tag.toLowerCase());
            }
        }
        return lodash_1.default.sortBy(results); // sort alphabetically descending (A-Z)
    }
    onTypeFilterChange(activeTypeFilters) {
        this.setState({
            activeTroubleshootingTypeFilters: activeTypeFilters
        });
    }
    onTagFilterChange(activeTagFilters) {
        this.setState({
            activeTroubleshootingTagFilters: activeTagFilters
        });
    }
    onFilterSearch(query) {
        this.setState({
            activeSearchQuery: query
        });
    }
    imagesAsArray(imagesObject) {
        let result = [];
        for (const item of imagesObject) {
            result.push(item.url);
        }
        return result;
    }
    render() {
        return (React.createElement(react_1.Fragment, null,
            this.state.loading &&
                React.createElement(LoadingSplash_1.default, null),
            !this.state.loading &&
                React.createElement(react_1.Fragment, null,
                    React.createElement(NavBar_1.default, { title: "CCSS Support Manual", searchable: false }),
                    React.createElement("section", { className: "container", id: "room-section" },
                        React.createElement(GeneralInfo_1.default, { title: this.getTitle(), room: this.state.room }),
                        this.state.images.panoramicImages.length > 0 &&
                            React.createElement(react_1.Fragment, null,
                                React.createElement("div", { className: "row panoramas" },
                                    React.createElement("div", { className: "col" },
                                        React.createElement(ImageCarousel_1.default, { images: this.imagesAsArray(this.state.images.panoramicImages), height: "250px", id: "panoramas-carousel" })))),
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col-lg-4" },
                                React.createElement(ImageCarousel_1.default, { images: this.imagesAsArray(this.state.images.rootImages), height: "350px", id: "main-carousel" })),
                            React.createElement("div", { className: "col-lg-4" },
                                React.createElement("h5", null, "Furniture"),
                                React.createElement("hr", null),
                                React.createElement("p", { className: "detail-header" }, "Furniture Type"),
                                React.createElement("p", { className: "detail capitalized" }, this.state.room.furnitureType),
                                React.createElement("p", { className: "detail-header" }, "Chair Count"),
                                React.createElement("p", { className: "detail" }, this.state.room.chairCount),
                                React.createElement("p", { className: "detail-header" }, "Table Count"),
                                React.createElement("p", { className: "detail" }, this.state.room.tableCount)),
                            React.createElement("div", { className: "col-lg-4" },
                                React.createElement("h5", null, "Technology"),
                                React.createElement("hr", null),
                                React.createElement(react_1.Fragment, null,
                                    React.createElement("p", { className: "detail-header" }, "Audio"),
                                    React.createElement("span", null, this.state.room.audioRequiresProjector ?
                                        React.createElement("i", { className: "fas fa-volume-up", style: { color: 'orange' }, "data-toggle": "tooltip", title: "Audio requires projector" })
                                        :
                                            React.createElement("i", { className: "fas fa-volume-up", style: { color: 'gray' }, "data-toggle": "tooltip", title: "Audio does not require projector" }))),
                                this.state.room.hasTeachingStationComputer &&
                                    React.createElement(react_1.Fragment, null,
                                        React.createElement("p", { className: "detail-header" }, "Teaching Station Computer"),
                                        React.createElement("span", null,
                                            this.state.room.teachingStationComputerType === 'all-in-one' &&
                                                React.createElement("i", { className: "fas fa-desktop", "data-toggle": "tooltip", title: "All-In-One" }),
                                            this.state.room.teachingStationComputerType === 'tower' &&
                                                React.createElement("i", { className: "fas fa-server", "data-toggle": "tooltip", title: this.state.room.teachingStationComputerType }),
                                            this.state.room.teachingStationComputerType === 'mini-pc' &&
                                                React.createElement("i", { className: "fas fa-hdd", "data-toggle": "tooltip", title: this.state.room.teachingStationComputerType }),
                                            this.state.room.teachingStationComputerType === 'imac' &&
                                                React.createElement("i", { className: "fas fa-tv", "data-toggle": "tooltip", title: this.state.room.teachingStationComputerType }),
                                            this.state.room.teachingStationComputerType === 'laptop' &&
                                                React.createElement("i", { className: "fas fa-laptop", "data-toggle": "tooltip", title: this.state.room.teachingStationComputerType })),
                                        React.createElement("span", null,
                                            this.state.room.teachingStationComputerOS.includes('windows') &&
                                                React.createElement("i", { className: "fab fa-windows", "data-toggle": "tooltip", title: this.state.room.teachingStationComputerOS }),
                                            this.state.room.teachingStationComputerOS === 'osx' &&
                                                React.createElement("i", { className: "fab fa-apple", "data-toggle": "tooltip", title: this.state.room.teachingStationComputerOS }),
                                            this.state.room.teachingStationComputerOS.includes('linux') &&
                                                React.createElement("i", { className: "fab fa-linux" }))),
                                this.state.room.hasDVDPlayer &&
                                    React.createElement(react_1.Fragment, null,
                                        React.createElement("p", { className: "detail-header", "data-toggle": "collapse", "data-target": "#collapse-dvd-player", "aria-expanded": "false", "aria-controls": "collapse-dvd-player" }, "DVD Player"),
                                        React.createElement("div", { className: "collapse", id: "collapse-dvd-player" },
                                            React.createElement("p", { className: "detail-header" }, "DVD Player Type"),
                                            React.createElement("p", { className: "detail uppercase" }, this.state.room.dvdPlayerType))),
                                this.state.room.hasPrinter &&
                                    React.createElement(react_1.Fragment, null,
                                        React.createElement("p", { className: "detail-header", "data-toggle": "collapse", "data-target": "#collapse-printer", "aria-expanded": "false", "aria-controls": "collapse-printer" }, "Printer"),
                                        React.createElement("div", { className: "collapse", id: "collapse-printer" },
                                            this.state.room.printerSymquestNumber &&
                                                React.createElement(react_1.Fragment, null,
                                                    React.createElement("p", { className: "detail-header" }, "Printer Symquest Number"),
                                                    React.createElement("p", { className: "detail uppercase" }, this.state.room.printerSymquestNumber)),
                                            this.state.room.printerCartridgeType &&
                                                React.createElement(react_1.Fragment, null,
                                                    React.createElement("p", { className: "detail-header" }, "Printer Cartridge Type"),
                                                    React.createElement("p", { className: "detail uppercase" }, this.state.room.printerCartridgeType)))))),
                        React.createElement("hr", null),
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col-sm-3" },
                                React.createElement(SearchBox_1.default, { label: "Search", buttonText: "Clear", onChange: this.onFilterSearch, value: this.state.activeSearchQuery }),
                                React.createElement(FilterBox_1.default, { label: "Type Filters", keys: this.getAllTroubleshootingDataTypes(), buttonText: "Reset", onChange: this.onTypeFilterChange, enabledByDefault: true }),
                                React.createElement(FilterBox_1.default, { label: "Tag Filters", keys: this.getAllTroubleshootingDataTags(), buttonText: "Reset", onChange: this.onTagFilterChange, enabledByDefault: false })),
                            React.createElement("div", { className: "col" },
                                React.createElement(TroubleshootingTips_1.default, { troubleshootingData: this.state.troubleshootingData, typeFilters: this.state.activeTroubleshootingTypeFilters, tagFilters: this.state.activeTroubleshootingTagFilters, search: this.state.activeSearchQuery }))),
                        React.createElement("hr", null),
                        React.createElement("p", null,
                            "Last Updated: ",
                            this.state.room.lastChecked)))));
    }
}
exports.default = Room;
