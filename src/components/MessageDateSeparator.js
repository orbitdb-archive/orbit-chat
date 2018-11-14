'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function MessageDateSeparator ({ date }) {
  return <div className="dateSeparator">{date.toDateString()}</div>
}

MessageDateSeparator.propTypes = {
  date: PropTypes.object.isRequired
}

export default MessageDateSeparator
