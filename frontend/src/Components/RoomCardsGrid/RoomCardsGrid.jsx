import React, { Component } from 'react';
import './RoomCardsGrid.css';

import RoomCard from "../../Components/RoomCard/RoomCard";

class RoomCardsGrid extends Component {

    state = {
        rooms: []
    };

    componentDidMount() {
        this.setState({
            rooms: []
        });
    }

    render() {

        const items = this.props.rooms.map((room) =>
            <li key={room.id}>
                <RoomCard room={room} />
            </li>
        );

        return (
            <div className="RoomCardsGrid-Component">
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
}

export default RoomCardsGrid;