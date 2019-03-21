import React, { Component, Fragment } from 'react';
import './Home.css';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";

var _ = require('underscore');

class Home extends Component {

    constructor(props) {
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
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    buildings: [...this.state.buildings, ...data],
                }, function () {
                    this.fetchAllImages();
                });
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch buildings");
            });
    }

    fetchAllImages() {
        fetch('/api/v1/images/')
            .then(response => response.json())
            .then(data => {
                if (data == null) return;

                for (const item of data) {
                    var imagesObj = {
                        roomID: item.roomID,
                        mainImages: item.mainImages,
                        panoramicImages: item.panoramicImages,
                        equipmentImages: item.equipmentImages
                    };

                    this.setState({
                        images: [...this.state.images, imagesObj],
                        loading: false,
                    });
                }
            }).catch((error) => {
                console.log(error);
                console.log("Failed to fetch room images");
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
                if (room.id === roomObj.id) return building;
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
            return <p>Loading...</p>
        }

        var query = this.state.filterSearch;
        var queries = query.split(" ");

        var rooms = _(this.getAllRooms()).chain().sortBy(function (room) {
            return room.number;
        }, this).sortBy(function (room) {
            return this.getParentBuilding(room).internalName;
        }, this).value();

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
                            images={this.state.images}
                        />
                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Home;
