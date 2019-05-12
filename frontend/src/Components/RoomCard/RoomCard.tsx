import * as React from 'react';
import { Component } from 'react';

import { Link } from 'react-router-dom'

import './RoomCard.scss';

interface Props {
    building: any; // TODO make this explicit
    room: any; // TODO make this explicit
    images: any; // TODO make this explicit
}

interface State { }

class RoomCard extends Component<Props, State> {

    constructor(props: Props) {
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
            if (this.props.images.rootImages && this.props.images.rootImages.length > 0) {
                coverImage = this.props.images.rootImages[0].url;
            }
        }

        return (
            <div className="RoomCard-Component">
                <Link to={"buildings/" + this.props.room.buildingName + "/rooms/" + this.props.room.number} target="_blank">
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
