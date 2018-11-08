'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import Logger from 'utils/logger'

const logger = new Logger()

class SendMessage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    onSendMessage: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)

    this.inputField = React.createRef()
  }

  onSubmit (e) {
    e.preventDefault()

    const { onSendMessage } = this.props

    const inputField = this.inputField.current
    const text = inputField.value.trim()

    onSendMessage(text).then(() => {
      inputField.value = ''
      inputField.focus()
    })
  }

  render () {
    const { t, theme } = this.props

    return (
      <div className="SendMessage">
        <form onSubmit={this.onSubmit}>
          {/* {emojiPicker} */}
          <input
            ref={this.inputField}
            type="text"
            placeholder={t('channel.sendMessagePlaceholder')}
            autoComplete="true"
            style={theme}
            // onKeyDown={this.onKeyDown.bind(this)}
            // onInput={this.onInput.bind(this)}
          />
        </form>
      </div>
    )
  }
}

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
