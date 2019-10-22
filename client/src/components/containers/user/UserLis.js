import React, { Component } from "react";
import { Link } from "react-router-dom"
import { Row, Col } from "react-bootstrap";
import avater from "../../../assets/images/banner1.jpeg";

class UserList extends Component {

  render() {
    const { match, users } = this.props;
    console.log( users )
    const userData = users && users.users && users.users.length > 0 ? users.users.map( user => (
      <Col md={4} key={user._id}>
        <div className="poll-card">
          <div className="poll-image">
            <img src={avater} alt="poll" />
          </div>
          <hr />
          <p className="lead"><strong>Name</strong>: {user.firstName} {user.lastName}</p>
          <p><strong>Email </strong>: {user.email}</p>
          <p className="view">
            <Link to={`${ match.url }/${ user._id }`} style={{ textDecoration: "none" }}>
              View details
            </Link>
          </p>
        </div>
      </Col>
    ) ) : <p>Loading...</p>
    return (
      <div>
        <h3>Hello from users</h3>
        <Row>
          {userData}
        </Row>

      </div>
    )
  }
}

export default UserList;