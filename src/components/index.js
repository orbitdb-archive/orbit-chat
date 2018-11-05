'use strict'

import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import { version } from '../../package.json'

import RootStore from 'stores/RootStore'
import RootStoreContext from 'context/RootStoreContext'

import App from './App'

render(
  <RootStoreContext.Provider value={new RootStore()}>
    <HashRouter>
      <App />
    </HashRouter>
  </RootStoreContext.Provider>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
