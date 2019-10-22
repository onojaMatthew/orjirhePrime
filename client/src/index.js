import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk from "redux-thunk";
import App from './components/App';
import rootReducers from "./store/reducers/index";
import "./index.css";
import { isAuthenticated } from './helpers/authenticate';

const token = isAuthenticated().token;
axios.defaults.headers.common = {
  "x-auth-token": token
}

const store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(logger, thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
