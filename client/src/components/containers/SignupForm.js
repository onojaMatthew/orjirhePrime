import React, { Component } from "react";
import { connect } from "react-redux";
import Signup from "../contents/Signup";
import { Row, Col } from "react-bootstrap";
import { signup } from "../../store/actions/actions_signup";

class SignupForm extends Component{
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    usertype: "",
    success: false,
  }

  componentDidMount = () => {
    const pathname = window.location.pathname;
    if ( pathname === "/dashboard" || pathname === "/dashboard/" || pathname === "/dashboard/login" ) {
      this.setState( { usertype: "admin" } )
    } else {
      this.setState( { usertype: "user" } )
    }
  };
  
  handleChange = ( field, ev ) => {
    let fields = this.state;
    fields[ field ] = ev.target.value;
    this.setState( { fields } );
  }

  onSubmit = async ( e ) => {
    e.preventDefault();
    const { email, password, firstName, lastName } = this.state;
    const { title, signup } = this.props;
    let userType;

    if ( title.includes( "user" ) ) {
      userType = "user";
      this.setState( { usertype: "user" } );
    } else {
      userType = "admin";
      this.setState( { usertype: "admin" } );
    }

    const data = {
      email,
      password,
      firstName,
      lastName
    }
    try {
      await signup( data, userType );
    } catch ( err ) {}

    
  }
  
  render() {
    const { signup, title, account } = this.props;
    const { email, password, firstName, lastName, usertype } = this.state;
    console.log(account, " accoun")
    if ( account.isSignupSuccess && usertype === "user" ) {
      window.location.href = "/login";
    } 
    

    if ( account.isSignupSuccess && usertype === "admin" ) {
      window.location.href = "/dashboard/login";
    }
    
    return (
      <div className="signupform">
        <Row>
          <Col md={4}></Col>
          <Col md={4}>
            <Signup
              signup={signup}
              title={title}
              email={email}
              firstName={firstName}
              lastName={lastName}
              password={password}
              onSubmit={this.onSubmit}
              handleChange={this.handleChange}
              account={account}
              usertype={usertype}
            />
          </Col>
          <Col md={4}></Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    account: state.account
  }
}

const mapDispatchToProps = ( dispatch ) => {
  const dispatchProps = {
    signup: (data, userType) => dispatch(signup(data, userType)),
  };

  return dispatchProps;
}

export default connect( mapStateToProps, mapDispatchToProps )( SignupForm );