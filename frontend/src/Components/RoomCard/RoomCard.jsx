import React, { Component } from 'react';
import './RoomCard.css';

import { Card, Button } from 'react-bootstrap';

class RoomCard extends Component {

    componentDidMount() {
        this.setState({
        });
    }


    render() {
        return (
            <div className="RoomCard-Component">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="img/300x200.png" />
                    <Card.Body>
                        <Card.Title>{this.props.room.name}</Card.Title>
                        <Card.Subtitle>{this.props.room.building.officialName} {this.props.room.number}</Card.Subtitle>
                        <Card.Text>
                            {this.props.description}
                        </Card.Text>
                        <Button variant="primary">Read More</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default RoomCard;
