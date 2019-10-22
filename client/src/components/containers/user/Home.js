import React, { Component } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getUsers } from "../../../store/actions/actions_signup";

class Home extends Component {
  async componentDidMount() {
    const { getPoll } = this.props;
    try {
      await getPoll();
    } catch(err) {}
  }
  render() {
    return (
      <div>
        <Row className="justify-content-md-center mt-5">
          <div className="mt-5">
            <h3>Welcome to our platform</h3>
          </div>
        </Row>
        <Row className="justify-content-md-center">
          <div>
            <h4>Here you can vote, like and comment on polls</h4>
            <p>Feel free to sign up and explore our awesome features</p>
            
          </div>
        </Row>
        <Row className="justify-content-md-center">
          <Link to="/signup"><Button variant="info">Sign up</Button></Link>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    users: state.account
  }
}

const mapDispatchToProps = ( dispatch ) => {
  const dispatchToProps = {
    getUsers: () => dispatch( getUsers() )
  }

  return dispatchToProps;
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );