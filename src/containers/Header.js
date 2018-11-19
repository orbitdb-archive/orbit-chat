'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import RootStoreContext from 'context/RootStoreContext'

import ChannelLink from 'components/ChannelLink'

import 'styles/Header.scss'

class Header extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    match: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.onChannelClick = this.onChannelClick.bind(this)
    this.onHeaderClick = this.onHeaderClick.bind(this)
  }

  onChannelClick (e) {
    // Stop propagation to Header
    e.stopPropagation()
    // No other actions needed since ChannelLink is doing the rest
  }

  onHeaderClick (e) {
    const { uiStore } = this.context
    uiStore.openControlPanel()
  }

  render () {
    const { networkStore, uiStore } = this.context
    const {
      match: {
        params: { channel: currentChannelName }
      }
    } = this.props

    const otherChannels = networkStore.channelsAsArray
      .filter(c => c.name !== currentChannelName)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(c => (
        <ChannelLink
          key={c.name}
          channel={c}
          theme={{ ...uiStore.theme }}
          onClick={this.onChannelClick}
        />
      ))

    return (
      <div className="Header" onClick={this.onHeaderClick}>
        <div className="ChannelName">
          <div className="currentChannel">
            <CSSTransitionGroup
              component="div"
              transitionName="channelHeaderAnimation"
              transitionEnter={true}
              transitionLeave={false}
              transitionAppear={false}
              transitionAppearTimeout={0}
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={0}>
              <span>#{currentChannelName}</span>
            </CSSTransitionGroup>
          </div>
          {otherChannels}
        </div>
      </div>
    )
  }
}

export default observer(Header)
