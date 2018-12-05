'use strict'

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { hot, setConfig } from 'react-hot-loader'
import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import __PrivateRoute from '../components/PrivateRoute'

import ControlPanel from '../containers/ControlPanel'
import ChannelHeader from '../containers/ChannelHeader'
import MessageUserProfilePanel from '../containers/MessageUserProfilePanel'

import ChannelView from './ChannelView'
import IndexView from './IndexView'
import LoginView from './LoginView'
import SettingsView from './SettingsView'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

setConfig({
  pureSFC: true,
  pureRender: true
})

const loginPath = '/connect'

function _PrivateRoute (props, { sessionStore }) {
  if (!sessionStore) return null
  return (
    <__PrivateRoute
      {...props}
      loginPath={loginPath}
      isAuthenticated={sessionStore.isAuthenticated}
    />
  )
}
_PrivateRoute.contextType = RootStoreContext
const PrivateRoute = observer(_PrivateRoute)

class App extends React.Component {
  static contextType = RootStoreContext

  render () {
    return (
      <div className="App view">
        <PrivateRoute component={MessageUserProfilePanel} />
        <PrivateRoute component={ControlPanel} />

        <Route exact path="/channel/:channel" component={ChannelHeader} />
        <Route exact path="/settings" component={ChannelHeader} />

        <Switch>
          <Route exact path={loginPath} component={LoginView} />
          <PrivateRoute exact path="/channel/:channel" component={ChannelView} />
          <PrivateRoute exact path="/settings" component={SettingsView} />
          <PrivateRoute component={IndexView} />
        </Switch>
      </div>
    )
  }
}

export default hot(module)(observer(App))
