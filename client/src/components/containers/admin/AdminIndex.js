import React, { Component } from 'react';
import { Row } from "react-bootstrap";
import { connect } from "react-redux";
import Banner from './Banner';
import NewPoll from './poll/NewPoll';
import { createPoll, getPoll, uploadPoll, tagPoll } from '../../../store/actions/actions_polls';

class AdminIndex extends Component {
  render() {
    const { createPoll, uploadPoll, getPoll } = this.props;
    console.log( this.props.polls, " from index admin")
    return (
      <div>
        <Banner />
        <hr />
        <Row className="justify-content-md-center">
          <NewPoll
            createPoll={createPoll}
            uploadPoll={uploadPoll}
            getPoll={getPoll}
            polls={this.props.polls}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    polls: state.polls
  }
}

const mapDispatchToProps = ( dispatch ) => {
  const dispatchToProps = {
    createPoll: ( data, userId, token ) => dispatch( createPoll( data, userId, token ) ),
    uploadPoll: ( data) => dispatch(uploadPoll(data)),
    getPoll: () => dispatch( getPoll() ),
    tagPoll: () => dispatch( tagPoll()), 
  }

  return dispatchToProps;
}
 
export default connect( mapStateToProps, mapDispatchToProps)(AdminIndex);
