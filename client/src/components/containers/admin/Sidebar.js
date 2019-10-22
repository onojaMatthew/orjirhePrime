import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";
import { isAuthenticated } from "../../../helpers/authenticate"
import user from "../../../assets/images/user1.png"

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <Row className="justify-content-md-center">
          <div className="user-image mt-4">
            <img src={user} alt="user" />
          </div>
        </Row>
        <Row className="justify-content-md-center name">
          <p>{isAuthenticated().user ? isAuthenticated().user.firstName : null}</p>
        </Row>
        <hr />
        <Row className="">
          <Link to={"/dashboard/index"}><h5>Dashboard</h5></Link>
        </Row>
        <Row className="">
          <div>
            <p><Link to={"/dashboard/index/polls"}>Poll Management</Link></p>
          </div>
        </Row>
        <Row>
          <div>
            <p><Link to={"/dashboard/index/users"}>Users Management</Link></p>
          </div>
        </Row>
      </div>
    );
  }
}

export default Sidebar;