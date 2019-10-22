import React from "react";
import { Link } from "react-router-dom";
import { Alert, Spinner, Form, Button } from "react-bootstrap";
import avatar from "../../assets/images/signup.jpeg";

function Signup( { account, usertype, firstName, lastName, email, password, title, onSubmit, handleChange }) {
  return (
    <div className="signup mb-5">
      <Form>
        <div className="box-center">
          <img
            src={avatar}
            alt="avatar"
            style={{ background: "#fff" }}
          />
        </div>
        <h4 style={{
          marginTop: 10,
          marginBottom: 10
        }}>{title}</h4>
        {account.error.length > 0 ? <Alert variant="danger">{account.error}</Alert> : null}
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First name"
            className="form-control"
            value={firstName}
            onChange={( e ) => handleChange( "firstName", e )}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last name"
            className="form-control"
            value={lastName}
            onChange={( e ) => handleChange( "lastName", e )}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            className="form-control"
            value={email}
            onChange={(e) => handleChange("email", e)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => handleChange("password", e)}
          />
        </Form.Group>
        {account.issignupLoading === true ? (
          <Spinner variant="info"/>
        ) : (
        <Button
          variant="primary"
          className="button"
          onClick={( e ) => onSubmit( e )}
        >
          Submit
        </Button>)}
        
      </Form>
      <p>Don't have an account ? {usertype === "user" ? (
        <Link to="/signup">Login</Link>
        ) : (
          <Link to="/dashboard/login">Login</Link>
        )}
      </p>
    </div>
  );
}

export default Signup;