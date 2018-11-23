'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Logger from '../utils/logger'

import Spinner from '../components/Spinner'

import SendMessage from './SendMessage'

const logger = new Logger()

class ChannelControls extends React.Component {
  static propTypes = {
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
    const { channel, ...rest } = this.props
    return (
      <div className="Controls">
        <Spinner
          loading={channel.loadingNewMessages || channel.sendingMessage}
          color="rgba(255, 255, 255, 0.7)"
          size="16px"
        />
        <SendMessage onSendMessage={this.sendMessage} {...rest} />
      </div>
    )
  }
}

export default observer(ChannelControls)
