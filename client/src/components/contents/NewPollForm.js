import React from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";

const NewPollForm = ( { onSubmit, onFileChange, handleChange, name, photo, polls, uploadMessage } ) => {
  console.log( polls, " uploading")
  return (
    <div className="new-poll-form">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <h3>Create new poll</h3>
          {polls && polls.uploadLoading === true ? <p style={{ color: "#00ff00" }}>{uploadMessage}</p> : null}
          {polls && polls.createPollSuccess === true ? <p style={{ color: "#00ff00" }}>Poll created successfully.</p> : null}
          <p style={{ color: "#007bff"}}>Upload poll photo first before adding the name</p>
          <Form>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Poll photo</Form.Label>
              <Form.Control
                type="file"
                name={photo}
                className="form-control"
                onChange={( e ) => onFileChange( e )}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Poll name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                className="form-control"
                value={name}
                onChange={( e ) => handleChange( "name", e )}
              />
            </Form.Group>
              <Button
                variant="info"
                onClick={( e ) => onSubmit( e )}
                disabled={polls.uploadLoading === false}
              >
                Submit
            </Button>
          </Form>
          </Col>
        </Row>
    </div>
  )
}

export default NewPollForm;