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
      .map(c => <ChannelLink key={c.name} channel={c} theme={{ ...uiStore.theme }} />)

    return (
      <div className="Header">
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
