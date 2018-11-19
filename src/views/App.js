'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'

import RootStoreContext from 'context/RootStoreContext'

import ChannelView from 'views/ChannelView'
import IndexView from 'views/IndexView'
import LoginView from 'views/LoginView'

import ControlPanel from 'containers/ControlPanel'
import Header from 'containers/Header'
// import DevTools from 'containers/DevTools'

import PrivateRoute from 'components/PrivateRoute'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

class App extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    match: PropTypes.object.isRequired
  }

  render () {
    const { sessionStore, uiStore } = this.context

    // const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null

    return (
      <div className="App view">
        {uiStore.isControlPanelOpen ? <ControlPanel /> : null}

        <Route path="/channel/:channel" component={Header} />

        <Switch>
          <Route exact path="/connect" component={LoginView} />

          <PrivateRoute
            path="/channel/:channel"
            loginPath={'/connect'}
            isAuthenticated={sessionStore.isAuthenticated}
            component={ChannelView}
          />

          <PrivateRoute
            loginPath={'/connect'}
            isAuthenticated={sessionStore.isAuthenticated}
            component={observer(IndexView)}
          />
        </Switch>
        {/* {devTools} */}
      </div>
    )
  }
}

export default hot(module)(observer(App))
