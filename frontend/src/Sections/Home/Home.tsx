import * as React from 'react';
import { Component, Fragment } from 'react';

import './Home.scss';

import { Transition, animated } from 'react-spring/renderprops'

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";
import LoadingSplash from "../../Components/LoadingSplash/LoadingSplash";

var _ = require('underscore');


interface Props {

}

interface State {
    loading: boolean;
    buildings: any[];
    images: any[];
    filterSearch: string;
}

class Home extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            buildings: [],
            images: [],
            filterSearch: ''
        };

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.fetchBuildings();
    }

    fetchBuildings() {
        let self = this;
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then(data => {
                self.setState({
                    buildings: data,
                }, function () {
                    self.fetchAllImages();
                });
            }).catch((error) => {
                console.error("Failed to fetch buildings");
                console.error(error);
            });
    }

    fetchAllImages() {
        let self = this;
        fetch('/api/v1/images/')
            .then(response => response.json())
            .then(data => {
                if (data == null) return;
                self.setState({
                    images: data,
                    loading: false,
                });
            }).catch((error) => {
                console.error("Failed to fetch room images");
                console.error(error);
            });
    }

    getAllRooms() {
        let result: any[] = [];
        for (const building of this.state.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }


    getParentBuilding(roomObj: any) {
        for (const building of this.state.buildings) {
            for (const room of building.rooms) {
                if (room.buildingName === roomObj.buildingName && room.number === roomObj.number) return building;
            }
        }
        return null;
    }


    onSearch(value: string) {
        this.setState({
            filterSearch: value
        });
    }


    render() {

        let self = this;

        var query = this.state.filterSearch;
        var queries = query.split(" ");

        var rooms = _(this.getAllRooms()).chain().sortBy(function (room: any) {
            return room.number;
        }, this).sortBy(function (room: any) {
            return self.getParentBuilding(room).internalName;
        }, this).value();

        for (const q of queries) {
            rooms = rooms.filter(function (room: any) {
                var pb = self.getParentBuilding(room);
                if (!pb) return false;

                var isNick = false;
                for (const nick of pb.nicknames) {
                    if (nick.includes(q)) {
                        isNick = true;
                        break;
                    }
                }

                return (room.number.includes(q) || room.name.includes(q) || pb.internalName.includes(q) || pb.officialName.includes(q) || isNick);
            }, this);
        }

        return (
            <Fragment>

                <Transition
                    native
                    items={this.state.loading}
                    // from={{ opacity: 0 }}
                    enter={{ opacity: 1 }}
                    leave={{ opacity: 0 }}
                >
                    {(item => item && (styles =>
                        (
                            <animated.div style={styles}>
                                <LoadingSplash />
                            </animated.div>
                        ))
                    )}
                </Transition>

                {!this.state.loading &&
                    <Fragment>
                        <NavBar
                            title="CCSS Support Manual"
                            searchable={true}
                            onSearch={this.onSearch}
                            fixed={true}
                        />
                        <section className="container-fluid" id="home-section">
                            <div className="Home-Component">
                                <RoomCardsGrid
                                    rooms={rooms}
                                    buildings={this.state.buildings}
                                    images={this.state.images}
                                />
                            </div>
                        </section>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

export default Home;
