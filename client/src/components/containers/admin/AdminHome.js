import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Sidebar from './Sidebar';
import AdminIndex from './AdminIndex';
import Poll from './poll/Poll';
import Users from './users/Users';

class AdminHome extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Row>
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9}>
            <Switch>
              <Route exact path={`${ match.url }`} component={AdminIndex} />
              <Route path={`${ match.url }/polls`} component={Poll} />
              <Route path={`${ match.url }/users`} component={(props) => <Users {...props}/>} />
              <Route path={"/"} component={""} />
            </Switch>
          </Col>
        </Row>
        
      </div>
    )
  }
}

export default AdminHome;
