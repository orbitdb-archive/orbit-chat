'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import 'styles/ChannelLink.scss'

function ChannelLink ({ channel, theme }) {
  return (
    <Link
      to={`/channel/${channel.name}`}
      key={channel.name}
      className={classNames('ChannelLink', {
        hasUnreadMessages: channel.hasUnreadMessages,
        hasMentions: channel.hasMentions
      })}
      style={theme}>
      #{channel.name}
      {channel.hasUnreadMessages ? (
        <span className="unreadMessages">{channel.unreadMessages.length}</span>
      ) : null}
    </Link>
  )
}

ChannelLink.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default ChannelLink
