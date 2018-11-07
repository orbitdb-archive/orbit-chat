'use strict'

import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'

import { version } from '../package.json'

import RootStore from 'stores/RootStore'
import RootStoreContext from 'context/RootStoreContext'

import App from 'components/App'

import 'styles/normalize.css'
import 'styles/Main.scss'

render(
  <RootStoreContext.Provider value={new RootStore()}>
    <Router>
      {/* Render App in a route so it will receive the "location" prop
          and rerender properly on location changes */}
      <Route component={App} />
    </Router>
  </RootStoreContext.Provider>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
