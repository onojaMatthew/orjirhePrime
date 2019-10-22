import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import avatar from "../../../assets/images/banner1.jpeg";
import Auth from "../../../helpers/Auth";

const PollList = ( { polls, match, } ) => {
  console.log(polls, " polls from pollsn")
  const pollData = polls && polls.polls && polls.polls.length > 0 ? polls.polls.map( poll => {
    return (
      <Col md={4} key={poll._id}>
      <div className="poll-card">
        <div className="poll-image">
          <img src={`http://localhost:3030/poll/photo/${ poll._id }`}
            onError={( i ) => i.target.src = `${ avatar }`} alt="poll" />
        </div>
        <hr />
        <p className="lead">{poll.name}</p>
        <p className="view">
          {Auth.isUserAuthenticated() ? (
            <Link to={`/polls/${ poll._id }`} style={{ textDecoration: "none" }}>
              View details
            </Link>
          ): (
            <Redirect to={"/login"} />
          )}
        </p>
      </div>
    </Col>
    )
  }): <p>Poll List is empt</p>
    
  return (
    <div className="signup">
      <div className="container">
        <Row>
          {pollData}
        </Row>
      </div>
    </div>
  );
}

export default PollList;
