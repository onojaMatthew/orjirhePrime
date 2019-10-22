import React, { Component } from "react";
import { Button, Col, Row, Alert } from "react-bootstrap";
import avatar from "../../../assets/images/banner1.jpeg";
import { userType, isAuthenticated } from "../../../helpers/authenticate";

class PollDetails extends Component {

  state = {
    comment: ""
  }

  /**
   * Deletes poll from the poll database
   */
  onVote = async ( pollId ) => {
    const userId = isAuthenticated().user._id;
    const { votePoll } = this.props;
    console.log(pollId)
    try {
      await votePoll( pollId, userId );
    } catch ( err ) { }
  }

  onLike = async ( pollId) => {
    const { likePoll } = this.props;
    console.log(pollId)
    try {
      await likePoll( pollId );
    } catch ( err ) { }

  }

  handleChange = ( name, e ) => {
    let field = this.state;
    field[ name ] = e.target.value;
    this.setState( { field } );
  }

  postComment = async ( pollId, e ) => {
    e.preventDefault();
    const firstName = isAuthenticated().user.firstName;
    const lastName = isAuthenticated().user.lastName;
    const { comment } = this.state;
    const { postComment } = this.props;

    const data = {
      firstName, lastName, comment
    }
    console.log( pollId, " from comment")
    try {
      await postComment( data, pollId );
    } catch(err) {}
  }


  render() {
    const { polls, match } = this.props;
    let selectedPoll = polls && polls.polls && polls.polls.length > 0 ? polls.polls.find( poll => poll._id === match.params.pollId ) : null;
    const pId = selectedPoll ? selectedPoll._id : null;
    const comments = selectedPoll && selectedPoll.comment && selectedPoll.comment.map( comment => (
      <div key={comment._id}>
        <hr />
        <p><strong>Name</strong>: {comment.firstName} {comment.lastName}</p>
        <p>{comment.comment}</p>
      </div>
    ) );
    const tag = selectedPoll && selectedPoll.tags.map( tag => tag );
    return (
      <div className="detail">

        <Row className="justify-content-md-center">
          <Col md={10}>
            <h5>{selectedPoll && selectedPoll.name}</h5>
            <img
              src={`http://localhost:3030/poll/photo/${ pId }`}
              alt="poll"
              onError={( i ) => i.target.src = `${ avatar }`}
              style={{
                height: "400px",
                width: "100%"
              }}
            />
            <Row>

            </Row>
            <Row className="mb-5 mt-3">
              <Col md={4}>
                <h6><strong>tags</strong>: {tag && tag.join( " " )}</h6>
              </Col>
              <Col md={2}>
                <h6><strong>Votes</strong>: {selectedPoll && selectedPoll.votes.length}</h6>
              </Col>
              <Col md={2}>
                <h6><strong>Likes</strong>: {selectedPoll && selectedPoll.likes.length}</h6>
              </Col>
            </Row>
            {polls.error.length > 0 && polls.error.includes( "voted" ) ? <Alert variant="danger">{polls.error}</Alert> : null}
            {polls.error.length > 0 && polls.error.includes( "liked" ) ? <Alert variant="danger">{polls.error}</Alert> : null}
            {userType() === "user" ? (
                <Row>
                  <Col md={4}>
                  <Button
                    variant="info"
                    onClick={() => this.onLike( selectedPoll._id )}
                    disabled={selectedPoll && selectedPoll.disabled === true}
                  >
                    Like
                  </Button>
                  </Col>
                  <Col md={4}>
                  <Button
                    disabled={selectedPoll && selectedPoll.disabled === true}
                    variant="primary"
                    onClick={() => this.onVote(selectedPoll._id)}
                  >
                    Vote
                  </Button>
                  </Col> 
                </Row>
              ) : null
            }
            <hr />
            {polls.error.length > 0 && !polls.error.includes( "liked" ) && !polls.error.includes( "voted" )? <Alert variant="danger">{polls.error}</Alert> : null}
            <Row className="mb-5 mt-5">
              <Col md={12}>
                <form className="form-inline">
                  <div className="form-group mx-sm-3 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Comment"
                      value={this.state.comment}
                      onChange={(e) => this.handleChange("comment", e)}
                    />
                  </div>
                  <button
                    disabled={selectedPoll && selectedPoll.disabled === true}
                    className="btn btn-info mb-2"
                    onClick={( e ) => this.postComment(selectedPoll._id, e)}
                  >Post Comment</button>
                </form>
              </Col>
            </Row>

            <Row className="mb-5">

              <Col>
                <h5>Comments</h5>
                {comments}
              </Col>

            </Row> 
          </Col>
        </Row>
      </div>
    )
  }
}

export default PollDetails;