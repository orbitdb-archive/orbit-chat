'use strict'

import React from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import 'styles/ChannelLink.scss'

function ChannelLink ({ channel, theme, ...rest }) {
  return (
    <NavLink
      to={`/channel/${channel.name}`}
      key={channel.name}
      className={classNames('ChannelLink', {
        hasUnreadMessages: channel.hasUnreadMessages,
        hasMentions: channel.hasMentions
      })}
      style={theme}
      {...rest}>
      #{channel.name}
      {channel.hasUnreadMessages ? (
        <span className="unreadMessages">{channel.unreadMessages.length}</span>
      ) : null}
    </NavLink>
  )
}

ChannelLink.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default observer(ChannelLink)
