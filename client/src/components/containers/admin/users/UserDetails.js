import React, { Component } from "react";
import { Row, Col, Button } from "react-bootstrap";
import avatar from "../../../../assets/images/banner1.jpeg";

class UserDetails extends Component {

  /**
 * Deletes poll from the poll database
 */
  onDelete = async (userId) => {
    const { deleteUser } = this.props;
    try {
      await deleteUser( userId );
      window.location.href = "/dashboard/index/users";
    } catch ( err ) { }
  }
  render() {
    const { users: { users }, match, polls } = this.props;
    const currentUser = users && users.find( user => user._id === match.params.userId );
    let userPolls = [];
    const userId = match.params.userId;
    const allPolls = polls && polls.polls ? polls.polls : null;
    for ( let i = 0; i < allPolls.length; i++ ) {
      let eachPoll = allPolls[ i ];
      let comments = eachPoll.comment.map( comment => comment.createdBy );
      if ( eachPoll.likes.includes( userId ) || eachPoll.votes.includes( userId ) || comments.includes( userId ) ) {
        userPolls.push( eachPoll )
      }
    }

    return (
      <div>
        <div className="detail">

          <Row className="justify-content-md-center">
            <Col md={10}>
              <img src={avatar} alt="poll" />
              <hr />

              <Row className="mb-5 mt-3">
                <Col md={12}>
                  <p><strong>Name</strong>:{currentUser && currentUser.firstName} {currentUser && currentUser.lastName}</p>
                  <p><strong>Email</strong>:{currentUser  && currentUser.email}</p>
                </Col>
              </Row>
              <Row className="justify-content-md-right mb-5">
                <Button
                  variant="danger"
                  onClick={() => this.onDelete(currentUser._id)}
                >Delete user</Button>
              </Row>
              <hr />
              <h4 className="mb-5">Poll feeds</h4>
              <>
                {userPolls && userPolls.map( feed => (

                  <Row key={feed._id} className="justify-content-md-right mb-3">
                    <Col md={2}>
                      <img
                        src={`http://localhost:3030/api/v1/poll/photo/${ feed._id }`}
                        alt=""
                        onError={( i ) => i.target.src = `${ avatar }`}
                        style={{ borderRadius: "50%", width: 50, height: 50 }}
                      />
                    </Col>
                    <Col md={10}>
                      <p><strong>Name</strong>: {feed.name ? feed.name : "No name"}</p>
                      <Row>
                        
                        <Col md={2}>
                          <p><strong>Likes</strong>: {feed.likes.length}</p>
                        </Col>
                        <Col md={2}>
                          <p><strong>Votes</strong>: {feed.votes.length}</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) )
                }
              </>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default UserDetails;