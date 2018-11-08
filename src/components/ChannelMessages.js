'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

function renderMessage (message) {
  return <div key={message.Hash}>{message.Post.content}</div>
}

function ChannelMessages ({ messages }) {
  return <div className="Messages">{messages.map(renderMessage)}</div>
}

ChannelMessages.propTypes = {
  messages: PropTypes.array.isRequired
}

export default observer(ChannelMessages)
