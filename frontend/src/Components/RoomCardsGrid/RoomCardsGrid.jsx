import React, { Component } from 'react';
import './RoomCardsGrid.scss';

import { CSSTransition, TransitionGroup } from "react-transition-group";

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
                if (room.id === roomObj.id) return building;
            }
        }
        return null;
    }

    getImages(room) {
        for (const item of this.props.images) {
            if (item.roomID === room.id) {
                return item;
            }
        }
        return [];
    }

    render() {

        const animatedItems = this.props.rooms.slice(0, 6).map((room) => {
            return (
                <CSSTransition
                    in={true}
                    timeout={300}
                    classNames="fade"
                    key={room.id}
                >
                    <li key={room.id}>
                        <RoomCard
                            room={room}
                            building={this.getParentBuilding(room)}
                            images={this.getImages(room)}
                        />
                    </li>
                </CSSTransition>
            );
        });

        const items = this.props.rooms.slice(6).map((room) => {
            return (
                <li key={room.id}>
                    <RoomCard
                        room={room}
                        building={this.getParentBuilding(room)}
                        images={this.getImages(room)}
                    />
                </li>
            );
        });

        return (
            <div className="RoomCardsGrid-Component">
                <ul>
                    <TransitionGroup >
                        {animatedItems}
                    </TransitionGroup>
                    {items}
                </ul>
            </div>
        );
    }
}

export default RoomCardsGrid;