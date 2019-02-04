'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function FirstMessage ({ t, loading, hasMoreHistory, channelName, ...rest }) {
  return (
    <div className={classNames('firstMessage', { hasMoreHistory })} {...rest}>
      {loading
        ? t('channel.loadingHistory')
        : hasMoreHistory
          ? t('channel.loadMore', { channel: channelName })
          : t('channel.beginningOf', { channel: channelName })}
    </div>
  )
}

FirstMessage.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMoreHistory: PropTypes.bool.isRequired,
  channelName: PropTypes.string.isRequired
}

export default FirstMessage
