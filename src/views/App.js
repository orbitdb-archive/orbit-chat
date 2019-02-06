'use strict'

import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import LoadAsync from '../components/Loadable'

import i18n from '../config/i18n.config'

import RootStore from '../stores/RootStore'

import { addDebug } from '../utils/debug'

import PrivateRouteWithContext from '../containers/PrivateRouteWithContext'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/normalize.css'
import '../styles/Main.scss'
import '../styles/App.scss'
import '../styles/Scrollbars.scss'

import faviconUrl from '../images/OrbitLogo_32x32.png'

const rootStore = new RootStore(i18n)

addDebug({ rootStore })

const loginPath = '/connect'

const Favicon = LoadAsync({
  loader: () => import(/* webpackChunkName: "Favicon" */ 'react-favicon')
})

const ControlPanel = LoadAsync({
  loader: () => import(/* webpackChunkName: "ControlPanel" */ '../containers/ControlPanel')
})
const ChannelHeader = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelHeader" */ '../containers/ChannelHeader')
})

const ChannelView = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelView" */ './ChannelView')
})
const IndexView = LoadAsync({
  loader: () => import(/* webpackChunkName: "IndexView" */ './IndexView')
})
const LoginView = LoadAsync({
  loader: () => import(/* webpackChunkName: "LoginView" */ './LoginView')
})
const SettingsView = LoadAsync({
  loader: () => import(/* webpackChunkName: "SettingsView" */ './SettingsView')
})

function AppView () {
  return (
    <div className="App view">
      <Favicon url={faviconUrl} />
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
