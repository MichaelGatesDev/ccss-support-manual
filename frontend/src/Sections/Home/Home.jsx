import React, { Component, Fragment } from 'react';
import './Home.css';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            buildings: [],
            filterSearch: ''
        };

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        // this.fetchRooms();
        this.fetchBuildings();
    }

    fetchBuildings() {
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    buildings: [...this.state.buildings, ...data],
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error);
                console.log("Failed to fetch buildings");
            });
    }

    getAllRooms() {
        let result = [];
        for (const building of this.state.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }


    getParentBuilding(roomObj) {
        for (const building of this.state.buildings) {
            for (const room of building.rooms) {
                if (room._id === roomObj._id) return building;
            }
        }
        return null;
    }


    onSearch(value) {
        this.setState({
            filterSearch: value
        });
    }


    render() {

        if (this.state.loading) {
            // return splashscreen
        }

        var query = this.state.filterSearch;
        var queries = query.split(" ");

        var rooms = this.getAllRooms();
        for (const q of queries) {
            rooms = rooms.filter(function (room) {
                var pb = this.getParentBuilding(room);
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
                <NavBar
                    title="CCSS Support Manual"
                    searchable={true}
                    onSearch={this.onSearch}
                />
                <section className="container-fluid" id="home-section">
                    <div className="Home-Component">
                        <RoomCardsGrid
                            rooms={rooms}
                            buildings={this.state.buildings}
                        />
                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Home;
