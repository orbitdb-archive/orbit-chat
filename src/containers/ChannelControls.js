'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import SendMessage from 'components/SendMessage'

import Logger from 'utils/logger'

const logger = new Logger()

class ChannelControls extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendFile = this.sendFile.bind(this)
  }

  async sendMessage (text) {
    try {
      await this.props.channel.sendMessage(text)
    } catch (err) {
      logger.error(err)
    }
  }

  async sendFile () {
    logger.warn('onSendFiles not implemented')
  }

  render () {
    const { t, theme } = this.props
    return (
      <div className="Controls">
        <SendMessage t={t} theme={theme} onSendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default withNamespaces()(ChannelControls)
