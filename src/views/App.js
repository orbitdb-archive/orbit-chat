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
import SettingsView from 'views/SettingsView'

import ControlPanel from 'containers/ControlPanel'
import ChannelHeader from 'containers/ChannelHeader'
// import DevTools from 'containers/DevTools'

import PrivateRoute from 'components/PrivateRoute'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

const loginPath = '/connect'

function _MyPrivateRoute (props, { sessionStore }) {
  if (!sessionStore) return null
  return (
    <PrivateRoute {...props} loginPath={loginPath} isAuthenticated={sessionStore.isAuthenticated} />
  )
}
_MyPrivateRoute.contextType = RootStoreContext
const MyPrivateRoute = observer(_MyPrivateRoute)

class App extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    match: PropTypes.object.isRequired
  }

  render () {
    const { uiStore } = this.context

    // const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null

    return (
      <div className="App view">
        {uiStore.isControlPanelOpen ? <ControlPanel /> : null}

        <Route exact path="/channel/:channel" component={ChannelHeader} />
        <Route exact path="/settings" component={ChannelHeader} />

        <Switch>
          <Route exact path={loginPath} component={LoginView} />
          <MyPrivateRoute exact path="/channel/:channel" component={ChannelView} />
          <MyPrivateRoute exact path="/settings" component={SettingsView} />
          <MyPrivateRoute component={IndexView} />
        </Switch>
        {/* {devTools} */}
      </div>
    )
  }
}

export default hot(module)(observer(App))
