'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import Logger from 'utils/logger'

const logger = new Logger()

function FirstMessage ({ t, channel }) {
  return (
    <div className="firstMessage" onClick={() => logger.warn('loadOlderMessages not implemented')}>
      {channel.loadingHistory
        ? t('channel.loadingHistory')
        : t('channel.beginningOf', { channel: channel.name })}
    </div>
  )
}

FirstMessage.propTypes = {
  t: PropTypes.func.isRequired,
  channel: PropTypes.object.isRequired
}

export default FirstMessage
