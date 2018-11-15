'use strict'

import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import { version } from '../package.json'

import i18n from 'config/i18n.config'

import RootStore from 'stores/RootStore'
import RootStoreContext from 'context/RootStoreContext'

import App from 'views/App'

import 'styles/normalize.css'
import 'styles/Main.scss'

render(
  <I18nextProvider i18n={i18n}>
    <RootStoreContext.Provider value={new RootStore(i18n)}>
      <Router>
        {/* Render App in a route so it will receive the "location" prop
          and rerender properly on location changes */}
        <Route component={App} />
      </Router>
    </RootStoreContext.Provider>
  </I18nextProvider>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
