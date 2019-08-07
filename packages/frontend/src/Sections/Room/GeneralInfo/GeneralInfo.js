"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
require("./GeneralInfo.scss");
class GeneralInfo extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
    }
    render() {
        return (React.createElement(react_1.Fragment, null,
            React.createElement("div", { className: "GeneralInfo-Component" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col" },
                        React.createElement("h2", { className: "room-title capitalized" }, this.props.title))),
                this.props.room.name &&
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col" },
                            React.createElement("h3", null, this.props.room.name))),
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-lg-4" },
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col text-center" },
                                React.createElement("h4", null, "Room Type"))),
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col text-center" },
                                React.createElement("p", { className: "capitalized" }, this.props.room.type)))),
                    React.createElement("div", { className: "col-lg-4 text-center" },
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col text-center" },
                                React.createElement("h4", null, "Room Capacity"))),
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col text-center" },
                                React.createElement("p", { className: "capitalized" }, parseInt(this.props.room.capacity) === -1 ? 'N/A' : this.props.room.capacity)))),
                    React.createElement("div", { className: "col-lg-4 text-center" },
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col text-center" },
                                React.createElement("h4", null, "Room Extension"))),
                        React.createElement("div", { className: "row" },
                            React.createElement("div", { className: "col text-center" },
                                React.createElement("p", { className: "capitalized" }, this.props.room.phone ? this.props.room.phone.extension : 'N/A'))))))));
    }
}
exports.default = GeneralInfo;
