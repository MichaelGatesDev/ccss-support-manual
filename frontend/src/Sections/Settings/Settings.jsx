import React, { Component } from 'react';
import './Settings.css';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";
import { Button } from 'react-bootstrap';

class Settings extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <section id="Settings">
                <NavBar title="CCSS Support Manual" searchable={false} />

                <div className="container">

                    <Button>Sync from Excel</Button>

                </div>

            </section>
        );
    }
}

export default Settings;
