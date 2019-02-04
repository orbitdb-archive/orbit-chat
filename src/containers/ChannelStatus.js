'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { Observer } from 'mobx-react'

function ChannelStatus ({ t, channel, theme }) {
  return (
    <Observer>
      {() => (
        <div className="ChannelStatus" style={{ ...theme }}>
          {channel.userCount} {t('channel.status.users', { count: channel.userCount })}
        </div>
      )}
    </Observer>
  )
}

ChannelStatus.propTypes = {
  t: PropTypes.func.isRequired,
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withNamespaces()(ChannelStatus)
