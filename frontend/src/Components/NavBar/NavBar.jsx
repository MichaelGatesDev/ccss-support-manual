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
                <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">{this.props.title}</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {this.props.searchable &&
                            <div className="justify-content-center w-100">
                                <FormInput
                                    type="text"
                                    placeholder="Search for building, room name, or room number.."
                                    onChange={this.onSearch}
                                    value={this.state.searchQuery}
                                />
                            </div>
                        }
                        <ul className="navbar-nav ml-auto" id="navbarNavDropdown">
                            <li className="nav-item">
                                <a className="nav-link" href="https://banner.plattsburgh.edu/pls/prod/psu_genweb.master_sched_search" target="_blank">Master Schedule</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://suny.service-now.com/navpage.do" target="_blank">ServiceNow</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavBar;
