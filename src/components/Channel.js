'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import RootStoreContext from 'context/RootStoreContext'

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
        if (window.confirm(`Join #${channelName}?`)) {
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
    const { shouldRedirectToIndex } = this.state
    if (shouldRedirectToIndex) return <Redirect to="/" />
    return <div className="Channel" />
  }
}

export default withNamespaces()(Channel)
