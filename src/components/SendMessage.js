'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import 'styles/SendMessage.scss'

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

export default withNamespaces()(SendMessage)
