'use strict'

import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import { version } from '../../package.json'

import NetworkStore from 'stores/NetworkStore'
import UiStore from 'stores/UiStore'
import UserStore from 'stores/UserStore'

import App from './App'

const uiStore = new UiStore()
const userStore = new UserStore()
const networkStore = new NetworkStore({ userStore })

render(
  <HashRouter>
    <App
      networkStore={networkStore}
      uiStore={uiStore}
      userStore={userStore}
      ipfsStore={networkStore.ipfsStore}
    />
  </HashRouter>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
