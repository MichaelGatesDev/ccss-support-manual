import React, { Component } from 'react';
import './NavBar.css';

import FormInput from "../FormInput/FormInput";

// https://react-bootstrap.github.io/getting-started/support/
class NavBar extends Component {


    constructor(props) {
        super(props);

        this.state = {
            searchQuery: ''
        };

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
    }

    onSearch(value) {
        this.setState({
            searchQuery: value
        });
        this.props.onSearch(value);
    }

    render() {
        return (
            <div className="NavBar-Component">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                    <a className="navbar-brand" href="/">{this.props.title}</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {this.props.searchable &&
                            <div className="justify-content-center w-100">
                                <FormInput
                                    type="text"
                                    placeholder="Room Name / Room Number"
                                    onChange={this.onSearch}
                                    value={this.state.searchQuery}
                                />
                            </div>
                        }
                        <ul className="navbar-nav ml-auto" id="navbarNavDropdown">
                            <li className="nav-item">
                                <a className="nav-link" href="/settings">Settings</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/debug">Debug</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavBar;
