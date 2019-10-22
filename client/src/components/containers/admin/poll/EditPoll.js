import React, { Component } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { isAuthenticated } from "../../../../helpers/authenticate";

class EditPoll extends Component {
  state = {
    name: "",
    photo: "",
    tag: ""
  }

  handleChange = ( e, name ) => {
    console.log( e.target.name, e.target.value, " on change")
    let file = name === "photo" ? e.target.files[ 0 ] : e.target.value;
    let fields = this.state;
    fields[ name ] = file;
    this.setState( { fields } );
    console.log( this.state, " edit state")
  }

  onSubmit = async ( action ) => {
    const { tagPoll, createPoll, match } = this.props; // getPoll
    const { name, tag } = this.state; 
    const userId = isAuthenticated().user._id;
    const pollId = match.params.pollId; 
    let tags = [];
    let data;
    tags.push( tag );
    if ( action === "name" ) {
      data = {name}
      try {
        await createPoll( data, userId, pollId );
      } catch(err) {}
    } else if ( action === "upload" ) {
      try {
        
      } catch(err) {}
    } else {
      try {
        await tagPoll( tags, userId, pollId );
      } catch(err) {}
    }
  }

  render() {
    const { photo, name, tag } = this.state;
    return (
      <div>
        <Row className="justify-content-md-center mb-3">
          <Col md={7}>
            <h3>Edit Poll</h3>
          </Col>
          
        </Row>
        <Row className="justify-content-md-center mb-3">
          <Col md={7}>
            <h5>Edit poll tags</h5>
            <Form>
              <Form.Group controlId="formBasicEmail">
                {/* <Form.Label>Poll name</Form.Label> */}
                <Form.Control
                  type="text"
                  placeholder="Enter tags"
                  className="form-control"
                  value={tag}
                  onChange={( e ) => this.handleChange( e, "tag")}
                />
              </Form.Group>
              <Button
                variant="info"
                onClick={() => this.onSubmit("tags")}
                disabled={tag.length < 1}
              >
                Submit
            </Button>
            </Form>
            <hr />
          </Col>
        </Row>
        
        <Row className="justify-content-md-center mb-3">
          <Col md={7}>
            <h5>Edit poll photo</h5>
            <Form>
              <Form.Group controlId="formBasicPassword">
                {/* <Form.Label>Poll photo</Form.Label> */}
                <Form.Control
                  type="file"
                  className="form-control"
                  onChange={( e ) => this.handleChange( e, "photo" )}
                />
              </Form.Group>
              <Button
                variant="info"
                onClick={() => this.onSubmit("upload")}
                disabled={photo.length < 1}
              >
                Submit
            </Button>
            </Form>
            <hr />
          </Col>
        </Row>
        
        <Row className="justify-content-md-center">
          <Col md={7}>
            <h5>Edit poll name</h5>
            <Form>
              <Form.Group controlId="formBasicEmail">
                {/* <Form.Label>Poll name</Form.Label> */}
                <Form.Control
                  type="text"
                  placeholder="Enter poll name"
                  className="form-control"
                  value={name}
                  onChange={(e) => this.handleChange(e, "name")}
                />
              </Form.Group>
              <Button
                variant="info"
                onClick={() => this.onSubmit("name")}
                disabled={name.length < 1}
              >
                Submit
            </Button>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default EditPoll;