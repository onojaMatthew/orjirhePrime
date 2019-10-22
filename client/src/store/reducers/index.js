import { combineReducers } from "redux";
import account from "./reducers_signup";
import polls from "./reducers_poll";

const rootReducers = combineReducers({
  account,
  polls,
});

export default rootReducers;
