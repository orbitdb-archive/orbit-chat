'use strict'

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'

import RootStoreContext from 'context/RootStoreContext'

import ChannelView from 'views/ChannelView'
import LoadingView from 'views/LoadingView'
import LoginView from 'views/LoginView'

import ControlPanel from 'containers/ControlPanel'
import Header from 'containers/Header'
import DevTools from 'containers/DevTools'

import BackgroundAnimation from 'components/BackgroundAnimation'
import PrivateRoute from 'components/PrivateRoute'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

@observer
class DefaultView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { uiStore } = this.context

    uiStore.setTitle('Orbit')

    return (
      <div>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} />
      </div>
    )
  }
}

class App extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { sessionStore, uiStore } = this.context

    if (uiStore.loading) return <LoadingView />

    const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null

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
            component={DefaultView}
          />
        </Switch>
        {devTools}
      </div>
    )
  }
}

export default hot(module)(observer(App))
