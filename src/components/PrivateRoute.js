import React from 'react'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute ({ component: Component, loginPath, isAuthenticated, ...rest }) {
  function renderComponent (props) {
    return isAuthenticated ? <Component {...props} /> : <Redirect to={loginPath} />
  }
  return <Route {...rest} render={renderComponent} />
}

export default PrivateRoute
