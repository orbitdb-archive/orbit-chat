'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import Logger from '../utils/logger'

import RootStoreContext from '../context/RootStoreContext'

import Channel from '../containers/Channel'

import '../styles/ChannelView.scss'

setConfig({
  pureSFC: true,
  pureRender: true
})

const logger = new Logger()

class ChannelView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    t: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  }

  state = { shouldRedirectToIndex: false }

  componentDidMount () {
    this.checkNetwork()
    this.handleChannelName()
  }

  componentDidUpdate () {
    this.handleChannelName()
  }

  componentWillUnmount () {
    const { uiStore } = this.context
    uiStore.setCurrentChannelName(null)
    uiStore.closeUserProfilePanel()
  }

  checkNetwork () {
    const { networkStore } = this.context
    if (!networkStore.isOnline) {
      logger.warn(`Network is offline`)
      this.setState({ shouldRedirectToIndex: true })
    }
  }

  handleChannelName () {
    const { networkStore, uiStore } = this.context

    const {
      match: {
        params: { channel: channelName }
      }
    } = this.props

    if (networkStore.hasUnreadMessages) uiStore.setTitle(`* #${channelName} | Orbit`)
    else uiStore.setTitle(`#${channelName} | Orbit`)

    uiStore.setCurrentChannelName(channelName)
  }

  render () {
    const { shouldRedirectToIndex } = this.state

    if (shouldRedirectToIndex) return <Redirect to="/" />

    const {
      match: {
        params: { channel: channelName }
      }
    } = this.props

    return (
      <div className="ChannelView">
        <Channel channelName={channelName} />
      </div>
    )
  }
}

export default hot(module)(withNamespaces()(observer(ChannelView)))
