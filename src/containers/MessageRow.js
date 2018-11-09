'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function MessageRow ({ message }) {
  return <div className="Message">{message.Post.content}</div>
}

MessageRow.propTypes = {
  message: PropTypes.object.isRequired
}

export default MessageRow
