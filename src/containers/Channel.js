'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'

import RootStoreContext from 'context/RootStoreContext'

import ChannelControls from 'containers/ChannelControls'
import ChannelMessages from 'containers/ChannelMessages'

import Logger from 'utils/logger'

import 'styles/Channel.scss'

const logger = new Logger()

class Channel extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    channelName: PropTypes.string.isRequired
  }

  state = { shouldRedirectToIndex: false }

  componentDidMount () {
    this.checkNetworkAndChannel()
  }

  componentDidUpdate () {
    this.checkNetworkAndChannel()
  }

  checkNetworkAndChannel () {
    const { networkStore } = this.context
    const { channelName } = this.props

    if (networkStore.isOnline) {
      if (networkStore.channelNames.indexOf(channelName) === -1) {
        networkStore.joinChannel(channelName)
      }
    } else {
      logger.warn(`Network is offline`)
      this.setState({ shouldRedirectToIndex: true })
    }
  }

  render () {
    const { networkStore, uiStore } = this.context
    const { shouldRedirectToIndex } = this.state
    const { channelName } = this.props

    if (shouldRedirectToIndex) return <Redirect to="/" />

    const channel = networkStore.channels[channelName]

    if (!channel) return null

    const props = {
      theme: { ...uiStore.theme },
      channel,
      useEmojis: uiStore.useEmojis,
      emojiSet: uiStore.emojiSet
    }

    return (
      <div className="Channel flipped">
        <ChannelMessages {...props} />
        <ChannelControls {...props} />
      </div>
    )
  }
}

export default observer(Channel)
