import React, { Component } from "react";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { isAuthenticated } from "../helpers/authenticate";
import Auth from "../helpers/Auth";
import { logout } from "../store/actions/actions_signup";
  

class Header extends Component{
  state = {
    isLoggedIn: false
  }

  componentDidMount() {
    if ( isAuthenticated().token ) {
      this.setState( {
        isUserAuthenticated: true,
        isLoggedIn: false,
      } )
    }
  }
  

  handleLogout = async () => {
    const { logout } = this.props;
    Auth.deauthenticateUser();
    await logout();
    window.location.href = "/";
  }

  render() {
    const url = window.location.pathname;
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Poll App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {Auth.isUserAuthenticated() ? (
              <>
                <Nav.Link href="/polls">Polls</Nav.Link>
                <Nav.Link href="/users">Users</Nav.Link>
              </> 
            ) : null}
            {!Auth.isUserAuthenticated() ? (
              <>
                {url === "/dashboard" ? (
                  <NavDropdown title="Account" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/dashboard">Sign up as admin</NavDropdown.Item>
                    <NavDropdown.Item href="/dashboard/login">Login as admin</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </NavDropdown>
                ) : (
                    <NavDropdown title="Account" id="collasible-nav-dropdown">
                      <NavDropdown.Item href="/signup">Sign up as user</NavDropdown.Item>
                      <NavDropdown.Item href="/login">Login as user</NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                  )}
              </>
            ) : null}
            
          </Nav>
          <>
            <span style={{ color: "#fff"}}>{isAuthenticated().user ? isAuthenticated().user.firstName : null}</span>
            {this.state.isUserAuthenticated === true ? (
              <div
                className="btn btn-info ml-4"
                onClick={this.handleLogout}
              >
                Log out
              </div>
            ) : null}
          </>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapDispatchtoProps = ( dispatch ) => {
  const dispatchProps = {
    logout: () => dispatch( logout() )
  }

  return dispatchProps;
}


export default connect(null, mapDispatchtoProps)(Header);