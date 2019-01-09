'use strict'

import React from 'react'

import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import PrivateRoute from '../components/PrivateRoute'

class PrivateRouteWithContext extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { sessionStore } = this.context
    const { loginPath = '/connect', ...rest } = this.props
    return sessionStore ? (
      <PrivateRoute
        {...rest}
        loginPath={loginPath}
        isAuthenticated={sessionStore.isAuthenticated}
      />
    ) : null
  }
}

export default observer(PrivateRouteWithContext)
