import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import LinkButton from "../LinkButton/LinkButton";

import './RoomCard.css';

class RoomCard extends Component {


    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainImages: [],
            panoramicImages: [],
            equipmentImages: [],
        };
    }

    componentDidMount() {
        this.fetchImages();
    }

    fetchImages() {
        fetch('/api/v1/images/' + this.props.building._id + "/" + this.props.room._id)
            .then(response => response.json())
            .then(data => {
                if (data == null) return;
                this.setState({
                    loading: false,
                    mainImages: data.mainImages,
                    panoramicImages: data.panoramicImages,
                    equipmentImages: data.equipmentImages,
                });
            })
            .catch((error) => {
                console.log(error);
                console.log("Failed to fetch room images");
            });
    }

    getTitle() {
        return this.props.building.officialName + " " + this.props.room.number;
    }

    render() {

        if (this.state.loading) {
            return (
                <div className="RoomCard-Component">
                    <div className="card">
                        <img className="card-img-top" src={"img/300x200.png"} alt={"Placeholder image"} />
                        <div className="card-body">
                            <p className="card-title">Loading...</p>
                            <p className="card-subtitle"><br /></p>
                        </div>
                    </div>
                </div>
            );
        }


        var coverImage = "img/300x200.png";
        if (this.state.mainImages && this.state.mainImages.length > 0) {
            coverImage = this.state.mainImages[0];
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
