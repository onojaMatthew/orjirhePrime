import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import {
  getPoll,
  deletePoll,
  disablePoll,
  tagPoll,
  createPoll,
  enablePoll,
  uploadUpdate,
} from "../../../../store/actions/actions_polls";
import PollList from './PollList';
import PollDetails from './PollDetails';

class Poll extends Component {
  async componentDidMount() {
    try {
      await this.props.getPoll();
    } catch ( err ) { }
  }
  
  render() {
    const { polls, match, getPoll, enablePoll, uploadUpdate } = this.props;
    return (
      <div className="poll">
        
        <Switch>
          <Route exact path={`${ match.url }`}
            component={( props ) =>
              <PollList
                polls={polls}
                match={match}
                {...props}
              />} />
          <Route path={`${ match.url }/:pollId`}
            component={( props ) =>
              <PollDetails
                polls={polls}
                {...props}
                deletePoll={this.props.deletePoll}
                disablePoll={this.props.disablePoll}
                tagPoll={this.props.tagPoll}
                createPoll={this.props.createPoll}
                getPoll={getPoll}
                enablePoll={enablePoll}
                uploadUpdate={uploadUpdate}
              />
            } />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = ( state ) => {
  return {
    polls: state.polls
  }
}

const mapDispatchToProps = ( dispatch ) => {
  const dispatchToProps = {
    getPoll: () => dispatch( getPoll() ),
    deletePoll: ( pollId ) => dispatch( deletePoll( pollId ) ),
    disablePoll: ( pollId, userId ) => dispatch( disablePoll( pollId, userId ) ),
    enablePoll: (pollId, userId) => dispatch(enablePoll(pollId, userId)),
    tagPoll: ( data, userId, pollId ) => dispatch( tagPoll( data, userId, pollId ) ),
    createPoll: ( data, userId, pollId ) => dispatch( createPoll( data, userId, pollId ) ),
    uploadUpdate: ( photo, userId, pollId ) => dispatch( uploadUpdate( photo, userId, pollId ) ),
  }

  return dispatchToProps;
}

export default connect( mapStateToProps, mapDispatchToProps )( Poll);
