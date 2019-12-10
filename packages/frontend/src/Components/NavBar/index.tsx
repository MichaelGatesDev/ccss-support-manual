import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./style.scss";

import FormInput from "../FormInput";

interface Props {
  title: string;
  searchable?: boolean;
  fixed?: boolean;
  onSearch?: any;
}

interface State {
  searchQuery: string;
}

class NavBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchQuery: "",
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {

  }

  onSearch(value: string) {
    this.setState({
      searchQuery: value,
    });

    const { onSearch } = this.props;
    onSearch(value);
  }

  render() {
    const { fixed, title, searchable } = this.props;
    const { searchQuery } = this.state;
    return (
      <div className="NavBar-Component">

        <nav className={`navbar ${fixed ? "fixed-top" : ""} navbar-expand-md navbar-dark bg-dark`} role="navigation">

          {/* Left */}
          <div className="navbar-collapse collapse order-0 dual-collapse2">
            <Link to="/" className="navbar-brand">{title}</Link>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/buildings" className="nav-link" rel="noopener noreferrer">Buildings</Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link" rel="noopener noreferrer">Settings</Link>
              </li>
            </ul>
          </div>

          {/* Center */}
          <div className="mx-auto order-1 w-75">

            {
              searchable &&
              (
                <FormInput
                  placeholder="Search for building, room name, or room number.."
                  onChange={this.onSearch}
                  value={searchQuery}
                  selectedByDefault
                  alwaysSelected
                />
              )
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
                <a className="nav-link" href="https://booking.plattsburgh.edu/" target="_blank" rel="noopener noreferrer">Room Schedule</a>
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
