'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function FirstMessage ({ t, loading, channelName, ...rest }) {
  return (
    <div className="firstMessage" {...rest}>
      {loading ? t('channel.loadingHistory') : t('channel.beginningOf', { channel: channelName })}
    </div>
  )
}

FirstMessage.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  channelName: PropTypes.string.isRequired
}

export default FirstMessage
