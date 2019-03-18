import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './RoomCard.css';

class RoomCard extends Component {

    componentDidMount() {
        this.setState({
        });
    }


    render() {
        return (
            <div className="RoomCard-Component">
                <div className="card">
                    <img className="card-img-top" src="img/300x200.png" alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">{this.props.room.buildingName} {this.props.room.number}</h5>
                        <h6 className="card-subtitle">{this.props.room.name}</h6>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <Link to={`/rooms/${this.props.room._id}`}>View Details</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoomCard;
