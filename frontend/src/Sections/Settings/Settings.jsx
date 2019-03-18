import React, { Component, Fragment } from 'react';
import './Settings.css';

import NavBar from "../../Components/NavBar/NavBar";
import Button from "../../Components/Button/Button";
import FileSelectButton from "../../Components/FileSelectButton/FileSelectButton";

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

                        {/* <div className="row">
                            <span>Upload File</span>
                            <form ref='uploadForm'
                                id='uploadForm'
                                action='/upload'
                                method='post'
                                encType="multipart/form-data">
                                <FileSelectButton
                                    title="Update from spreadsheet"
                                    name="spreadsheet"
                                />
                                <Button
                                    title="Upload"
                                    preventDefault={true}
                                />
                                <input type='submit' value='Upload!' />

                            </form>
                        </div> */}

                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Settings;
