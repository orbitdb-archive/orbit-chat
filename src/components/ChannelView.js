'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import RootStoreContext from 'context/RootStoreContext'

import Channel from 'components/Channel'

import 'styles/ChannelView.scss'

class ChannelView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    t: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  }

  state = { shouldRedirectToIndex: false }

  componentDidMount () {
    const { ipfsStore, networkStore } = this.context

    if (!networkStore.isOnline) {
      if (window.confirm(`Start network?`)) {
        ipfsStore.useJsIPFS()
      } else {
        this.setState({ shouldRedirectToIndex: true })
      }
    }
  }

  render () {
    const { uiStore } = this.context
    const {
      match: {
        params: { channel }
      }
    } = this.props
    const { shouldRedirectToIndex } = this.state

    if (shouldRedirectToIndex) return <Redirect to="/" />

    uiStore.setTitle(`#${channel} | Orbit`)

    return (
      <div className="ChannelView">
        {/* Add 'key' prop so react will create a new Channel component on 'channel' changes */}
        <Channel channelName={channel} key={channel} />
      </div>
    )
  }
}

export default withNamespaces()(ChannelView)
