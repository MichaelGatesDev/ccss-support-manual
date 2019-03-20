import React, { Component, Fragment } from 'react';
import './Settings.css';

import NavBar from "../../Components/NavBar/NavBar";

class Settings extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <Fragment>
                <NavBar title="CCSS Support Manual" searchable={false} />
                <section className="container" id="settings-section">
                    <div className="Settings-Component">

                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Settings;
