import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux";
import { getUsers, deleteUser } from '../../../../store/actions/actions_signup';
import UserList from './UserList';
import UserDetails from './UserDetails';
import { getPoll } from '../../../../store/actions/actions_polls';

class Users extends Component {
  async componentDidMount() {
    const { getUsers, getPoll } = this.props;
    try {
      await getUsers();
      await getPoll();
    } catch(err) {}
  }

  render() {
    const { match, users, polls, deleteUser } = this.props;

    return (
      <div>
        <Switch>
          <Route exact path={`${ match.url }`} component={( props ) => <UserList users={users} {...props} />} />
          <Route
            path={`${ match.url }/:userId`}
            component={( props ) =>
              <UserDetails
                deleteUser={deleteUser}
                users={users} {...props}
                polls={polls}
              />}
          />
        </Switch>
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
    getUsers: () => dispatch( getUsers() ),
    deleteUser: ( userId ) => dispatch( deleteUser( userId ) ),
    getPoll: () => dispatch(getPoll())
  }

  return dispatchToProps;
}

export default connect( mapStateToProps, mapDispatchToProps )( Users );