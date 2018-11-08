'use strict'

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import RootStoreContext from 'context/RootStoreContext'

import ChannelMessages from 'components/ChannelMessages'
import ChannelControls from 'components/ChannelControls'

import Logger from 'utils/logger'

import 'styles/Channel.scss'

const logger = new Logger()

class Channel extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    t: PropTypes.func.isRequired,
    channelName: PropTypes.string.isRequired
  }

  state = { shouldRedirectToIndex: false }

  componentDidMount () {
    const { networkStore } = this.context
    const { channelName } = this.props

    if (networkStore.isOnline) {
      if (networkStore.channelNames.indexOf(channelName) === -1) {
        if (window.confirm(`__ Join #${channelName}? __`)) {
          networkStore.joinChannel(channelName)
        } else {
          this.setState({ shouldRedirectToIndex: true })
        }
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

    const channel = networkStore.getChannel(channelName)

    if (!channel) return null

    return (
      <div className="Channel">
        <ChannelMessages messages={channel.messages} theme={{ ...uiStore.theme }} />
        <ChannelControls theme={{ ...uiStore.theme }} channel={channel} />
      </div>
    )
  }
}

export default withNamespaces()(observer(Channel))
