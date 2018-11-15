'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import RootStoreContext from 'context/RootStoreContext'

import MessageRow from 'containers/MessageRow'

import FirstMessage from 'components/FirstMessage'
import MessageDateSeparator from 'components/MessageDateSeparator'

function ChannelMessages ({ t, channel, ...rest }, { uiStore, sessionStore }) {
  const { colorifyUsernames, useLargeMessage, useMonospaceFont, language } = uiStore

  let prevDate

  // Reduce so we can put the date separators in
  const messageEls = channel.messages.reduce((els, message) => {
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

  // Add an element to the beginning of messages to indicate whether there are
  // older messages or we are at the beginning of the channels history
  messageEls.unshift(<FirstMessage key="firstMessage" channel={channel} t={t} />)

  return <div className="Messages">{messageEls}</div>
}

ChannelMessages.propTypes = {
  t: PropTypes.func.isRequired,
  channel: PropTypes.object.isRequired
}

ChannelMessages.contextType = RootStoreContext

export default withNamespaces()(observer(ChannelMessages))
