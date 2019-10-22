import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getPoll, votePoll, likePoll, postComment } from "../../../store/actions/actions_polls";
import PollList from "./PollList";
import PollDetails from "./PollDetails";

class Polls extends Component {
  async componentDidMount() {
    const { getPoll } = this.props;
    try {
      await getPoll();
    } catch ( err ) { }
  }
  render() {
    const {
      match,
      polls,
      likePoll,
      votePoll,
      postComment
    } = this.props;

    return (
      <div>
        <Switch>
          <Route exact path={`${ match.url }`} component={() => <PollList polls={polls} match={match} />} />
          <Route
            path={`${ match.url }/:pollId`}
            component={( props ) =>
              <PollDetails
                polls={polls}
                {...props}
                votePoll={votePoll}
                likePoll={likePoll}
                postComment={postComment}
              />
            } />
        </Switch>
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
    getPoll: () => dispatch( getPoll() ),
    votePoll: ( pollId ) => dispatch( votePoll( pollId ) ),
    likePoll: ( pollId ) => dispatch( likePoll( pollId ) ),
    postComment: ( data, pollId ) => dispatch( postComment( data, pollId))
  }

  return dispatchToProps;
}

export default connect( mapStateToProps, mapDispatchToProps )( Polls );