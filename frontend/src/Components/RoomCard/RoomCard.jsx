import React, { Component } from 'react';

import LinkButton from "../LinkButton/LinkButton";

import './RoomCard.css';

class RoomCard extends Component {

    componentDidMount() {
        this.setState({
        });
    }

    getAbbreviatedName(name) {
        let result = "";
        for (const word of name.split(" ")) {
            if (word.length < 1) continue;
            result += word[0];
        }
        return result;
    }

    render() {
        return (
            <div className="RoomCard-Component">
                <div className="card">
                    <img className="card-img-top" src="img/300x200.png" alt="Card image cap" />
                    <div className="card-body">
                        <p className="card-title">{this.props.room.buildingName} {this.props.room.number}</p>
                        <p className="card-subtitle">{this.props.room.name ? this.props.room.name : <br />}</p>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <LinkButton
                            title="View Details"
                            href={`/rooms/${this.props.room._id}`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default RoomCard;
