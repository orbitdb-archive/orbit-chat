'use strict'

import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import i18n from '../config/i18n.config'

import RootStore from '../stores/RootStore'

import { addDebug } from '../utils/debug'

import RootStoreContext from '../context/RootStoreContext'

import PrivateRouteWithContext from '../containers/PrivateRouteWithContext'
import ControlPanel from '../containers/ControlPanel'
import ChannelHeader from '../containers/ChannelHeader'
import MessageUserProfilePanel from '../containers/MessageUserProfilePanel'

import ChannelView from './ChannelView'
import IndexView from './IndexView'
import LoginView from './LoginView'
import SettingsView from './SettingsView'

import '../styles/normalize.css'
import '../styles/Main.scss'
import '../styles/App.scss'
import '../styles/Scrollbars.scss'

const rootStore = new RootStore(i18n)

addDebug({ rootStore })

const loginPath = '/connect'

function AppView () {
  return (
    <div className="App view">
      {/* Render the profile panel of a user */}
      {/* This is the panel that is shown when a username is clicked in chat  */}
      <MessageUserProfilePanel />

      {/* Only render ControlPanel when logged in */}
      <PrivateRouteWithContext component={ControlPanel} />

      {/* Render ChannelHeader when in a channel OR when in settings */}
      <Route exact path="/channel/:channel" component={ChannelHeader} />
      <Route exact path="/settings" component={ChannelHeader} />

      <Switch>
        <Route exact path={loginPath} component={LoginView} />
        <PrivateRouteWithContext exact path="/channel/:channel" component={ChannelView} />
        <PrivateRouteWithContext exact path="/settings" component={SettingsView} />
        <PrivateRouteWithContext component={IndexView} />
      </Switch>
    </div>
  )
}

function App () {
  return (
    <I18nextProvider i18n={i18n}>
      <RootStoreContext.Provider value={rootStore}>
        <Router>
          {/* Render App in a route so it will receive the "location"
              prop and rerender properly on location changes */}
          <Route component={AppView} />
        </Router>
      </RootStoreContext.Provider>
    </I18nextProvider>
  )
}

export default App
