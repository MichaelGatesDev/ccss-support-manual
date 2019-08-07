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
const react_redux_1 = require("react-redux");
const lodash_1 = __importDefault(require("lodash"));
require("./Home.scss");
const NavBar_1 = __importDefault(require("../../Components/NavBar/NavBar"));
const RoomCardsGrid_1 = __importDefault(require("../../Components/RoomCardsGrid/RoomCardsGrid"));
const LoadingSplash_1 = __importDefault(require("../../Components/LoadingSplash/LoadingSplash"));
const actions_1 = require("../../redux/buildings/actions");
const actions_2 = require("../../redux/images/actions");
const common_1 = require("@ccss-support-manual/common");
class Home extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterSearch: ''
        };
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount() {
        this.props.fetchBuildings();
        this.props.fetchImages();
    }
    getAllRooms() {
        let result = [];
        for (const building of this.props.buildingsState.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }
    getParentBuilding(room) {
        for (const building of this.props.buildingsState.buildings) {
            if (room.buildingName === building.internalName)
                return building;
        }
        return null;
    }
    onSearch(value) {
        this.setState({
            filterSearch: value
        });
    }
    isLoading() {
        return this.props.buildingsState.buildingsLoading || this.props.imagesState.imagesLoading;
    }
    filterRoomsByName(rooms, name, filterNumber = true, filterName = true, filterBuildingName = true) {
        let self = this;
        return rooms.filter(function (room) {
            let pb = self.getParentBuilding(room);
            if (!pb)
                return false;
            return ((filterNumber && room.number.toLocaleLowerCase().includes(name)) ||
                (filterName && room.name.toLocaleLowerCase().includes(name)) ||
                (filterBuildingName && common_1.BuildingUtils.hasName(pb, name)));
        }, this);
    }
    render() {
        let rooms = this.getAllRooms();
        if (!this.isLoading()) {
            let query = this.state.filterSearch;
            let queries = query.split(" ");
            rooms = lodash_1.default.sortBy(rooms, ["buildingName", "number"]);
            for (let query of queries) {
                query = query.toLocaleLowerCase();
                rooms = this.filterRoomsByName(rooms, query);
            }
        }
        return (React.createElement(react_1.Fragment, null,
            this.isLoading() &&
                React.createElement(LoadingSplash_1.default, null),
            !this.isLoading() &&
                React.createElement(react_1.Fragment, null,
                    React.createElement(NavBar_1.default, { title: "CCSS Support Manual", searchable: true, onSearch: this.onSearch, fixed: true }),
                    React.createElement("section", { className: "container-fluid", id: "home-section" },
                        React.createElement("div", { className: "Home-Component" },
                            React.createElement(RoomCardsGrid_1.default, { rooms: rooms, buildings: this.props.buildingsState.buildings, images: this.props.imagesState.images }))))));
    }
}
const mapStateToProps = (state) => ({
    buildingsState: state.buildings,
    imagesState: state.images,
});
exports.default = react_redux_1.connect(mapStateToProps, { fetchBuildings: actions_1.fetchBuildings, fetchImages: actions_2.fetchImages })(Home);
