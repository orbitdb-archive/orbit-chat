'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import RootStoreContext from 'context/RootStoreContext'

import MessageRow from 'containers/MessageRow'

import Logger from 'utils/logger'

const logger = new Logger()

function ChannelMessages ({ channel }, { uiStore }) {
  let prevDate

  // Reduce so we can put the date separators in
  const messageEls = channel.messages.reduce((els, m) => {
    const date = new Date(m.Post.meta.ts)
    if (date.getDate() !== prevDate) {
      prevDate = date.getDate()
      // Add date separator
      els.push(
        <div className="dateSeparator" key={date}>
          {date.toDateString()}
        </div>
      )
    }

    // Add the message
    els.push(<MessageRow key={m.Hash} message={m} useLargeMessage={uiStore.useLargeMessage} />)

    return els
  }, [])

  // Add an element to the beginning of messages to indicate whether there are
  // older messages or we are at the beginning of the channels history
  messageEls.unshift(
    <div
      className="firstMessage"
      key="firstMessage"
      onClick={() => logger.warn('loadOlderMessages not implemented')}>
      {channel.loadingHistory ? `Loading history...` : `Beginning of #${channel.name}`}
    </div>
  )

  return <div className="Messages">{messageEls}</div>
}

ChannelMessages.propTypes = {
  channel: PropTypes.object.isRequired
}

ChannelMessages.contextType = RootStoreContext

export default observer(ChannelMessages)
