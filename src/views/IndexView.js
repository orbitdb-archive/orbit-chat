'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

setConfig({
  pureSFC: true,
  pureRender: true
})

class IndexView extends React.Component {
  static contextType = RootStoreContext

  componentDidMount () {
    const { uiStore } = this.context
    uiStore.setTitle('Orbit')
    uiStore.openControlPanel()
  }

  componentDidUpdate () {
    const { uiStore } = this.context
    uiStore.setTitle('Orbit')
    uiStore.openControlPanel()
  }

  render () {
    return null
  }
}

export default hot(module)(observer(IndexView))
