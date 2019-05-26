import * as React from 'react';
import { Component } from 'react';

import './RoomCardsGrid.scss';

import RoomCard from "../RoomCard/RoomCard";

interface Props {
    rooms: Room[];
    buildings: Building[];
    images: ImageCollection | null;
}

interface State {
}

class RoomCardsGrid extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        };

        this.getParentBuilding = this.getParentBuilding.bind(this);
        this.getImagesForRoom = this.getImagesForRoom.bind(this);
    }

    componentDidMount() {
    }



    getParentBuilding(roomObj: any) {
        for (const building of this.props.buildings) {
            for (const room of building.rooms) {
                if (room.buildingName === roomObj.buildingName && room.number === roomObj.number) return building;
            }
        }
        return null;
    }

    getImagesForRoom(buildingName: string, roomNumber: string): RoomImages | null {
        if (!this.props.images) return null;
        let roomImages = this.props.images.roomImages;
        if (!roomImages) return null;
        for (const item of roomImages) {
            if (
                item.buildingName === buildingName &&
                item.roomNumber === roomNumber
            ) {
                return item;
            }
        }
        return null;
    }

    render() {

        const items = this.props.rooms.map((room, index) => {
            let parentBuilding = this.getParentBuilding(room);
            if (!parentBuilding) return null;
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