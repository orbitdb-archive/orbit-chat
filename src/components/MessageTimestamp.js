'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import getFormattedTime from 'utils/get-formatted-time'

function MessageTimestamp ({ message }) {
  return <span className="Timestamp">{getFormattedTime(message.Post.meta.ts)}</span>
}

MessageTimestamp.propTypes = {
  message: PropTypes.object.isRequired
}

export default MessageTimestamp
