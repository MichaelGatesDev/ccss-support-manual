import * as React from 'react';
import { Component } from 'react';

import './RoomCardsGrid.scss';

import RoomCard from "../RoomCard/RoomCard";

interface Props {
    //TODO make explicit
    buildings: any[];
    rooms: any[];
    images: any;
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

    getImagesForRoom(buildingName: string, roomNumber: string) {
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