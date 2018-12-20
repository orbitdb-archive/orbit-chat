'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Logger from '../utils/logger'

import FileUploadButton from '../components/FileUploadButton'
import Spinner from '../components/Spinner'

import ChannelStatus from './ChannelStatus'
import SendMessage from './SendMessage'

const logger = new Logger()

function ChannelControls ({ channel, ...rest }) {
  async function sendMessage (text) {
    try {
      await channel.sendMessage(text)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async function sendFiles (files) {
    try {
      await channel.sendFiles(files)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  return (
    <div className="Controls">
      <Spinner loading={channel.loadingNewMessages || channel.sendingMessage} />
      <SendMessage onSendMessage={sendMessage} {...rest} />
      <FileUploadButton onSelectFiles={sendFiles} {...rest} />
      <ChannelStatus channel={channel} {...rest} />
    </div>
  )
}

ChannelControls.propTypes = {
  channel: PropTypes.object.isRequired
}

export default observer(ChannelControls)
