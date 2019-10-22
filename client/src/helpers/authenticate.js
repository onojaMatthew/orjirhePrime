export const isAuthenticated = () => {
  if ( typeof window === "undefined" ) {
    return false;
  }

  if ( localStorage.getItem( "token" ) ) {
    return JSON.parse( localStorage.getItem( "token" ) );
  } else {
    return false;
  }
}

/**
 * Get the userType from localStorage
 */
export const userType = () => {
  if ( typeof window === "undefined" ) {
    return false;
  }

  if ( localStorage.getItem( "token" ) ) {
    const userType = isAuthenticated().user.userType;
    return userType;
  }
}