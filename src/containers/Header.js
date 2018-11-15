'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import RootStoreContext from 'context/RootStoreContext'

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
      .map(c => (
        <Link
          to={`/channel/${c.name}`}
          key={c.name}
          className={classNames('channel', {
            hasUnreadMessages: c.hasUnreadMessages,
            hasMentions: c.hasMentions
          })}
          style={{ ...uiStore.theme }}>
          #{c.name}
          {c.hasUnreadMessages ? (
            <span className="unreadMessages">{c.unreadMessages.length}</span>
          ) : null}
        </Link>
      ))

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
