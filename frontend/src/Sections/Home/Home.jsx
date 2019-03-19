import React, { Component, Fragment } from 'react';
import './Home.css';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            rooms: [],
            filterSearch: ''
        };

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.fetchRooms();
    }

    fetchRooms() {
        fetch('/api/v1/rooms')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    rooms: [...this.state.rooms, ...data],
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error);
                console.log("Failed to fetch rooms, using examples..");

                var exampleRoom = {
                    _id: Math.random(),
                    name: "Example Name",
                    number: "101B",
                    description: "This is an example description.",
                    buildingName: "Example Hall",
                    images: "",
                };
                this.setState({
                    rooms:
                        [
                            exampleRoom, exampleRoom, exampleRoom,
                            exampleRoom, exampleRoom, exampleRoom,
                            exampleRoom, exampleRoom, exampleRoom,
                        ]
                });
            });
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

        var rooms = this.state.rooms;
        var filteredRooms = rooms;
        for (const q of queries) {
            filteredRooms = filteredRooms.filter(function (room) {
                return (room.number.includes(q) || room.name.includes(q) || room.buildingName.includes(q));
            }, this);
        }

        // var filteredRooms = rooms.filter(function (room) {

        //     var query = this.state.filterSearch;

        //     // no query
        //     if (!query || query.trim().length === 0) {
        //         return true;
        //     }

        //     // no queries
        //     var queries = this.state.filterSearch.split(" ");
        //     if (queries.length === 0) {
        //         return true;
        //     }

        //     var queryMatched = false;

        //     for (const q of queries) {
        //         if (room.number.includes(q) || room.name.includes(q) || room.buildingName.includes(q)) {
        //             queryMatched = true;
        //         }
        //     }

        //     return queryMatched;

        //     // return (
        //     //     // filter by search query
        //     //     (this.state.filterSearch === '' || room.number.includes(this.state.filterSearch) || room.name.includes(this.state.filterSearch) || room.buildingName.includes(this.state.filterSearch))
        //     // );
        // }, this);

        return (
            <Fragment>
                <NavBar
                    title="CCSS Support Manual"
                    searchable={true}
                    onSearch={this.onSearch}
                />
                <section className="container" id="home-section">
                    <div className="Home-Component">
                        <RoomCardsGrid
                            rooms={filteredRooms}
                        />
                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Home;
