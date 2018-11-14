'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import Logger from 'utils/logger'

const logger = new Logger()

function FirstMessage ({ channel }) {
  return (
    <div className="firstMessage" onClick={() => logger.warn('loadOlderMessages not implemented')}>
      {channel.loadingHistory ? `Loading history...` : `Beginning of #${channel.name}`}
    </div>
  )
}

FirstMessage.propTypes = {
  channel: PropTypes.object.isRequired
}

export default FirstMessage
