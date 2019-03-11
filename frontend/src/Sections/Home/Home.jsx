import React, { Component } from 'react';
import './Home.css';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";

class Home extends Component {

    state = {
        loading: true,
        rooms: []
    }

    componentDidMount() {

        fetch('http://localhost:3001/api/buildings')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    rooms: [...this.state.rooms, ...data],
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error);
                console.log("Failed to fetch buildings, using examples..");
                this.setState({
                    rooms:
                        [
                            {
                                id: Math.random(),
                                name: "Example Name",
                                number: "101B",
                                description: "This is an example description.",
                                building: {
                                    officialName: "Test Building",
                                    nicknames: ["Test"]
                                },
                                images: "",
                            },
                            {
                                id: Math.random(),
                                name: "Example Name",
                                number: "101B",
                                description: "This is an example description.",
                                building: {
                                    officialName: "Test Building",
                                    nicknames: ["Test"]
                                },
                                images: "",
                            },
                            {
                                id: Math.random(),
                                name: "Example Name",
                                number: "101B",
                                description: "This is an example description.",
                                building: {
                                    officialName: "Test Building",
                                    nicknames: ["Test"]
                                },
                                images: "",
                            },
                            {
                                id: Math.random(),
                                name: "Example Name",
                                number: "101B",
                                description: "This is an example description.",
                                building: {
                                    officialName: "Test Building",
                                    nicknames: ["Test"]
                                },
                                images: "",
                            },
                            {
                                id: Math.random(),
                                name: "Example Name",
                                number: "101B",
                                description: "This is an example description.",
                                building: {
                                    officialName: "Test Building",
                                    nicknames: ["Test"]
                                },
                                images: "",
                            },
                        ]
                });
            });
    }

    render() {
        return (
            <section id="home">
                <NavBar title="CCSS Support Manual" searchable={true} />

                <div className="container">
                    <RoomCardsGrid
                        rooms={this.state.rooms}
                    />
                </div>

            </section>
        );
    }
}

export default Home;
