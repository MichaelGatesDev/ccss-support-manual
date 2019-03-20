import React, { Component } from 'react';
import './RoomCardsGrid.css';

import RoomCard from "../../Components/RoomCard/RoomCard";

class RoomCardsGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.getParentBuilding = this.getParentBuilding.bind(this);
        this.getImages = this.getImages.bind(this);
    }

    componentDidMount() {
    }

    getParentBuilding(roomObj) {
        for (const building of this.props.buildings) {
            for (const room of building.rooms) {
                if (room._id === roomObj._id) return building;
            }
        }
        return null;
    }

    getImages(room) {
        for (const item of this.props.images) {
            if (item.roomID === room._id) {
                return item;
            }
        }
        return [];
    }

    render() {

        const items = this.props.rooms.map((room) =>
            <li key={room._id}>
                <RoomCard
                    room={room}
                    building={this.getParentBuilding(room)}
                    images={this.getImages(room)}
                />
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