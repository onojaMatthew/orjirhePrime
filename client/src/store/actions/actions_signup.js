import axios from "axios";
import { userType, isAuthenticated } from "../../helpers/authenticate";
import Auth from "../../helpers/Auth";
export const SIGNUP_START = "SIGNUP_START";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILED = "SIGNUP_FAILED";
export const SIGNIN_START = "SIGNIN_START";
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_FAILED = "SIGNIN_FAILED";

export const GET_USERS_START = "GET_USERS_START";
export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
export const GET_USERS_FAILED = "GET_USERS_FAILED";

export const GET_USER_START = "GET_USER_START";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILED = "GET_USER_FAILED";

export const DELETE_USER_START = "DELETE_USERS_START";
export const DELETE_USER_SUCCESS = "DELETE_USERS_SUCCESS";
export const DELETE_USER_FAILED = "DELETE_USERS_FAILED";

export const LOGOUT_START = "LOGOUT_START";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILED = "LOGOUT_FAILED";

export const signupStart = () => {
  return {
    type: SIGNUP_START
  }
}

export const signupSuccess = ( data ) => {
  return {
    type: SIGNUP_SUCCESS,
    data
  }
}

export const signupFailed = ( error ) => {
  return {
    type: SIGNUP_FAILED,
    error
  }
}

export const signup = ( data, userType ) => {
  return dispatch => {
    dispatch( signupStart() );
    fetch( `http://localhost:3020/user/signup/${ userType }`, { 
      method: "POST",
      headers: {
        ACCEPT: "application/json",
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify( data)
    } )
      .then(response => response.json())
      .then( resp => {
        if ( resp.error ) {
          dispatch(signinFailed(resp.error))
        }
        dispatch( signupSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( signupFailed( err.message ) );
      } );
    
  }
}


// Login actions
export const signinStart = () => {
  return {
    type: SIGNIN_START
  }
}

export const signinSuccess = ( data ) => {
  return {
    type: SIGNIN_SUCCESS,
    data
  }
}

export const signinFailed = ( error ) => {
  return {
    type: SIGNIN_FAILED,
    error
  }
}

export const signin = ( data, userType ) => {
  return dispatch => {
    dispatch( signinStart() );
    fetch( `http://localhost:3020/user/signin`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ACCEPT: "application/json"
      },
      body: JSON.stringify(data)
    } )
      .then(response => response.json())
      .then( resp => {
        if ( resp.error ) {
          dispatch( signinFailed( resp.error ) );
          return;
        }
        Auth.authenticateUser( JSON.stringify(resp ));
        dispatch( signinSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( signinFailed( err.message ) );
      } );
  }
}


export const getUsersStart = () => {
  return {
    type: GET_USERS_START
  }
}

export const getUsersSuccess = ( data ) => {
  return {
    type: GET_USERS_SUCCESS,
    data
  }
}

export const getUsersFailed = ( error ) => {
  return {
    type: GET_USERS_FAILED,
    error
  }
}

export const getUsers = ( data, userType ) => {
  return dispatch => {
    dispatch( getUsersStart() );
    axios.get( `http://localhost:3020/user/all`, { data } )
      .then( resp => {
        dispatch( getUsersSuccess( resp.data ) );
      } )
      .catch( err => {
        dispatch( getUsersFailed( err.message ) );
      } );
  }
}

export const getUserStart = () => {
  return {
    type: GET_USER_START
  }
}

export const getUserSuccess = ( data ) => {
  return {
    type: GET_USER_SUCCESS,
    data
  }
}

export const getUserFailed = ( error ) => {
  return {
    type: GET_USER_FAILED,
    error
  }
}

export const getUser = ( userId ) => {
  return dispatch => {
    dispatch( getUsersStart() );
    fetch( `http://localhost:3020/user/user/${ userId }`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ACCEPT": "application/json",
        "x-auth-token": isAuthenticated().token
      }
    } )
      .then(response => response.json())
      .then( resp => {
        dispatch( getUsersSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( getUsersFailed( err.message ) );
      } );
  }
}

export const deleteUserStart = () => {
  return {
    type: DELETE_USER_START
  }
}

export const deleteUserSuccess = ( data ) => {
  return {
    type: DELETE_USER_SUCCESS,
    data
  }
}

export const deleteUserFailed = ( error ) => {
  return {
    type: DELETE_USER_FAILED,
    error
  }
}

export const deleteUser = (userId) => {
  return dispatch => {
    dispatch( deleteUserStart() );
    axios.delete( `http://localhost:3020/user/delete/${userId}/${userType()}`)
      .then( resp => {
        dispatch( deleteUserSuccess( resp.data ) );
      } )
      .catch( err => {
        dispatch( getUsersFailed( err.message ) );
      } );
  }
}


export const logoutStart = () => {
  return {
    type: LOGOUT_START
  }
}

export const logoutSuccess = ( data ) => {
  return {
    type: LOGOUT_SUCCESS,
    data
  }
}

export const logoutFailed = ( error ) => {
  return {
    type: LOGOUT_FAILED,
    error
  }
}

export const logout = () => {
  return dispatch => {
    dispatch( logoutStart() );
    fetch( `http://localhost:3020/user/signout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ACCEPT": "application/json"
      }
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( logoutSuccess( resp ) )
      } )
      .catch( err => {
        dispatch( logoutFailed( err.message ) );
      } );
  }
}