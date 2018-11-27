'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { observer } from 'mobx-react'

function ChannelStatus ({ t, channel, theme }) {
  const users = channel.peers.length + 1
  return (
    <div className="ChannelStatus" style={{ ...theme }}>
      {users} {t('channel.status.users', { count: users })}
    </div>
  )
}

ChannelStatus.propTypes = {
  t: PropTypes.func.isRequired,
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withNamespaces()(observer(ChannelStatus))
