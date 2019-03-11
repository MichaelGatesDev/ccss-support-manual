import React, { Component } from 'react';
import './NavBar.css';

import { Navbar, Nav, Form } from 'react-bootstrap';

// https://react-bootstrap.github.io/getting-started/support/
class NavBar extends Component {

    componentDidMount() {
        this.setState({
            searchQuery: ''
        });

        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(event) {
        this.setState({
            searchQuery: event.target.value
        });
    }

    render() {
        return (
            <div className="NavBar-Component">
                <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                    <Navbar.Brand href="/">
                        {this.props.title}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse>
                        {this.props.searchable &&
                            <Nav className="justify-content-center w-100">
                                <Form.Control
                                    className="form-control-dark"
                                    type="text"
                                    placeholder="Room Name / Room Number"
                                    aria-describedby="inputGroupPrepend"
                                    onChange={this.onSearch}
                                />
                            </Nav>
                        }
                        <Nav className="ml-auto">
                            <Nav.Link href="/settings">Settings</Nav.Link>
                            <Nav.Link href="/settings">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavBar;
