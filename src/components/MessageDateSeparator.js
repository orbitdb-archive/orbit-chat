'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import { getFormattedDateString } from 'utils/format-time'

function MessageDateSeparator ({ date, locale }) {
  return <div className="dateSeparator">{getFormattedDateString(date, locale)}</div>
}

MessageDateSeparator.propTypes = {
  date: PropTypes.object.isRequired,
  locale: PropTypes.string
}

MessageDateSeparator.defaultProps = {
  locale: 'en'
}

export default MessageDateSeparator
