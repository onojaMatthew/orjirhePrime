import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "react-bootstrap";
import avatar from "../../../assets/images/banner1.jpeg";
import { getUser, deleteUser } from "../../../store/actions/actions_signup";
import { getPoll } from "../../../store/actions/actions_polls";

class User extends Component {

  async componentDidMount() {
    const { getUser, match, getPoll } = this.props;
    const userId = match.params.userId;
    try {
      await getUser( userId );
      await getPoll();
    } catch(err) {}

  }
  /**
 * Deletes poll from the poll database
 */
  onDelete = async ( userId ) => {
    const { deleteUser } = this.props;
    try {
      await deleteUser( userId );
      window.location.href = "/users";
    } catch ( err ) { }
  }
  render() {
    const { users, polls, match } = this.props;
    let userPolls = [];
  
    const userId = match.params.userId;
    const currentUser = users && users.users ? users.users : null;
    const allPolls = polls && polls.polls;
    for ( let i = 0; i < allPolls.length; i++ ) {
      let eachPoll = allPolls[ i ];
      let comments = eachPoll.comment.map(comment => comment.createdBy);
      if ( eachPoll.likes.includes( userId ) || eachPoll.votes.includes( userId ) || comments.includes(userId)) {
        userPolls.push(eachPoll)
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
                <Col md={9}>
                  <p><strong>Name</strong>:{currentUser && currentUser.firstName} {currentUser && currentUser.lastName}</p>
                  <p><strong>Email</strong>:{currentUser && currentUser.email}</p>
                </Col>
                <Col md={3}>
                  <Button
                  variant="danger"
                  onClick={() => this.onDelete( currentUser._id )}
                  >Delete user</Button>
                </Col>
              </Row>
              <h4 className="mb-5">Poll feeds</h4>
              <>
                {userPolls && userPolls.map( feed => (
                  <>
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
                    <hr/>
                  </Row>
                  </>
                  ) )
                }
              </>
             
            </Col>
          </Row> 
        </div>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    users: state.account,
    polls: state.polls
  }
}

const mapDispatchToProps = ( dispatch ) => {
  const dispatchToProps = {
    getUser: ( userId ) => dispatch( getUser( userId ) ),
    getPoll: () => dispatch( getPoll()),
    deleteUser: ( userId ) => dispatch( deleteUser( userId ) )
  }

  return dispatchToProps;
}

export default connect(mapStateToProps, mapDispatchToProps)(User);