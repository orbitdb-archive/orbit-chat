'use strict'

import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import RootStoreContext from 'context/RootStoreContext'

import Channel from 'containers/Channel'

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
      if (window.confirm(`__ Start network? __`)) {
        ipfsStore.useJsIPFS()
      } else {
        this.setState({ shouldRedirectToIndex: true })
      }
    }
  }

  render () {
    const { uiStore } = this.context
    const { shouldRedirectToIndex } = this.state
    const {
      match: {
        params: { channel: channelName }
      }
    } = this.props

    if (shouldRedirectToIndex) return <Redirect to="/" />

    uiStore.setTitle(`#${channelName} | Orbit`)

    return (
      <div className="ChannelView">
        {/* Add 'key' prop so react will create a new Channel component on 'channel' changes */}
        <Channel channelName={channelName} key={channelName} />
      </div>
    )
  }
}

export default withNamespaces()(observer(ChannelView))
