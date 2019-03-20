import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './RoomCard.css';

class RoomCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    getTitle() {
        return this.props.building.officialName + " " + this.props.room.number;
    }

    render() {

        var coverImage = "img/300x200.png";
        if (this.props.images) {
            if (this.props.images.mainImages && this.props.images.mainImages.length > 0) {
                coverImage = this.props.images.mainImages[0];
            }
        }

        return (
            <div className="RoomCard-Component">
                <Link to={"room/" + this.props.room._id}>
                    <div className="card">
                        <img className="card-img-top" src={coverImage} alt={"Image of " + this.getTitle()} />
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
