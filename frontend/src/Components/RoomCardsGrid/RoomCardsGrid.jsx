import React, { Component } from 'react';
import './RoomCardsGrid.scss';

import RoomCard from "../../Components/RoomCard/RoomCard";

class RoomCardsGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.getParentBuilding = this.getParentBuilding.bind(this);
        this.getImagesForRoom = this.getImagesForRoom.bind(this);
    }

    componentDidMount() {
    }



    getParentBuilding(roomObj) {
        for (const building of this.props.buildings) {
            for (const room of building.rooms) {
                if (room.buildingName === roomObj.buildingName && room.number === roomObj.number) return building;
            }
        }
        return null;
    }

    getImagesForRoom(buildingName, roomNumber) {
        let roomImages = this.props.images.roomImages;
        for (const item of roomImages) {
            if (
                item.buildingName === buildingName &&
                item.roomNumber === roomNumber
            ) {
                return item;
            }
        }
    }

    render() {

        const items = this.props.rooms.map((room, index) => {
            let parentBuilding = this.getParentBuilding(room);
            return (
                <li key={index}>
                    <RoomCard
                        room={room}
                        building={parentBuilding}
                        images={this.getImagesForRoom(parentBuilding.internalName, room.number)}
                    />
                </li>
            );
        });


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