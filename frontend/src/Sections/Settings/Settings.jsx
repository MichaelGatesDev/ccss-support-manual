import React, { Component, Fragment } from 'react';
import './Settings.css';

import NavBar from "../../Components/NavBar/NavBar";
import Button from "../../Components/Button/Button";

class Settings extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <Fragment>
                <NavBar title="CCSS Support Manual" searchable={false} />
                <section className="container" id="settings-section">
                    <div className="Settings-Component">
                        <Button>Update from spreadsheet</Button>
                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Settings;
