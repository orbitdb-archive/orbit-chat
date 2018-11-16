'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import { throttleFunc } from 'utils/throttle'

import RootStoreContext from 'context/RootStoreContext'

import MessageRow from 'containers/MessageRow'

import FirstMessage from 'components/FirstMessage'
import MessageDateSeparator from 'components/MessageDateSeparator'

class ChannelMessages extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.messagesEl = React.createRef()
    this.messagesEnd = React.createRef()

    this.onScroll = throttleFunc(this.onScroll.bind(this))
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  onScroll (e) {
    // if (!this.messagesEl.current) return
    // const scrollTop = this.messagesEl.current.scrollTop
  }

  scrollToBottom () {
    if (!this.messagesEnd.current) return

    // Smooth scroll will cause the chat input field to bounce when sending
    // messages so we use the default ("auto")
    this.messagesEnd.current.scrollIntoView()
  }

  renderMessages () {
    const { sessionStore, uiStore } = this.context
    const { colorifyUsernames, useLargeMessage, useMonospaceFont, language } = uiStore
    const { t, channel, ...rest } = this.props

    let prevDate

    // Reduce so we can put the date separators in
    return channel.messages.reduce((els, message) => {
      const date = new Date(message.Post.meta.ts)

      if (date.getDate() !== prevDate) {
        prevDate = date.getDate()
        els.push(<MessageDateSeparator key={date} date={date} locale={language} />)
      }

      els.push(
        <MessageRow
          key={message.Hash}
          message={message}
          colorifyUsernames={colorifyUsernames}
          useLargeMessage={useLargeMessage}
          useMonospaceFont={useMonospaceFont}
          highlightWords={[sessionStore.username]}
          {...rest}
        />
      )

      return els
    }, [])
  }

  render () {
    const { t, channel } = this.props

    const messageEls = this.renderMessages()

    return (
      <div className="Messages" onScroll={this.onScroll} ref={this.messagesEl}>
        <FirstMessage key="firstMessage" channel={channel} t={t} />
        {messageEls}
        <span className="messagesEnd" ref={this.messagesEnd} />
      </div>
    )
  }
}

export default withNamespaces()(observer(ChannelMessages))
