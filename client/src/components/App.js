import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import SignupForm from './containers/SignupForm';
import Header from './Header';
import Home from './containers/user/Home';
import ErrorPage from './contents/404';
import SigninForm from './containers/SigninForm';
import Admin from './containers/admin/Admin';
import Polls from './containers/user/Polls';
import Users from "./containers/user/Users";
import User from './containers/user/User';


class App extends Component{
  state = {
    title: "", 
  }

  componentDidMount() {
    switch ( window.location.pathname ) {
      case "/signup":
        return this.setState( { title: "Sign up as user" } );
      case "/login":
        return this.setState( { title: "Log in as user" } );
      default:
        return this.state.title;
    }
    
  }
  
  render() {
    const { title } = this.state;
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={(props) => <Home {...props}/>} />
          <Route path="/signup" component={() => <SignupForm title={title} />} />
          <Route path="/login" component={() => <SigninForm title={title} />} />
          <Route path="/polls" component={( props ) => <Polls {...props} />} />
          <Route exact path="/users" component={( props ) => <Users {...props} />} />
          <Route path="/users/:userId" component={(props) => <User {...props} />} />
          <Route path="/dashboard" component={Admin} />
          <Route path="/*" component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
 