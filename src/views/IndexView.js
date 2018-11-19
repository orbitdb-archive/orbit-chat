'use strict'

import React from 'react'
import { observer } from 'mobx-react'

import RootStoreContext from 'context/RootStoreContext'

class IndexView extends React.Component {
  static contextType = RootStoreContext

  componentDidMount () {
    const { uiStore } = this.context
    uiStore.setTitle('Orbit')
    uiStore.openControlPanel()
  }

  render () {
    return null
  }
}

export default observer(IndexView)
