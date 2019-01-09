'use strict'

import React from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'

import App from './views/App'

render(<App />, document.getElementById('root'))

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
