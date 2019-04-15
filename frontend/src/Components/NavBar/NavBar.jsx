import React, { Component } from 'react';
import './NavBar.scss';

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

                <nav className={"navbar " + (this.props.fixed ? 'fixed-top ' : '') + "navbar-expand-md navbar-dark bg-dark"} role="navigation">

                    {/* Left */}
                    <div className="navbar-collapse collapse order-0 dual-collapse2">
                        <a className="navbar-brand" href="/">{this.props.title}</a>
                    </div>

                    {/* Center */}
                    <div className="mx-auto order-1 w-75">

                        {this.props.searchable &&
                            <FormInput
                                type="text"
                                placeholder="Search for building, room name, or room number.."
                                onChange={this.onSearch}
                                value={this.state.searchQuery}
                                selectedByDefault={true}
                                alwaysSelected={true}
                            />
                        }
                        <button
                            className="navbar-toggler w-100"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                    </div>

                    {/* Right */}
                    <div className="navbar-collapse collapse order-2 dual-collapse2" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto" id="navbarNavDropdown">
                            <li className="nav-item">
                                <a className="nav-link" href="https://banner.plattsburgh.edu/pls/prod/psu_genweb.master_sched_search" target="_blank" rel="noopener noreferrer">Master Schedule</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://booking.plattsburgh.edu/Web/schedule.php" target="_blank" rel="noopener noreferrer">Room Schedule</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://suny.service-now.com/navpage.do" target="_blank" rel="noopener noreferrer">ServiceNow</a>
                            </li>
                        </ul>
                    </div>

                </nav>
            </div>
        );
    }
}

export default NavBar;
