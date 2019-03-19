import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import LinkButton from "../LinkButton/LinkButton";

import './RoomCard.css';

class RoomCard extends Component {

    componentDidMount() {
        this.setState({
        });
        this.getCoverImage();
    }

    getCoverImage() {
        var buildingName = this.props.building.internalName;
        var number = this.props.room.number;
        var dir = "img/buildings/" + buildingName + "/rooms/" + number + "/";
        return dir + "cover.jpg";
    }

    getTitle() {
        return this.props.building.officialName + " " + this.props.room.number;
    }

    render() {
        return (

            <div className="RoomCard-Component">
                <Link to={"room/" + this.props.room._id}>
                    <div className="card">
                        <img className="card-img-top" src={"img/300x200.png"} alt={"Image of " + this.getTitle()} />
                        <div className="card-body">
                            <p className="card-title">{this.getTitle()}</p>
                            <p className="card-subtitle">{this.props.room.name ? this.props.room.name : <br />}</p>
                            {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default RoomCard;
