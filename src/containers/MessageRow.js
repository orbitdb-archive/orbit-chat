'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import IntersectObserver from 'react-intersection-observer'

import MessageTimestamp from '../components/MessageTimestamp'
import MessageUser from '../components/MessageUser'
import MessageUserAvatar from '../components/MessageUserAvatar'
import MessageContent from '../components/MessageContent'

import '../styles/MessageRow.scss'

function MessageRow ({
  message,
  colorifyUsernames,
  useLargeMessage,
  useEmojis,
  emojiSet,
  onInViewChange,
  highlightWords
}) {
  const isCommand = message.Post.content && message.Post.content.startsWith('/me')

  const messageTimestamp = <MessageTimestamp message={message} />

  const messageUser = (
    <MessageUser message={message} colorify={colorifyUsernames} isCommand={isCommand} />
  )

  const messageContent = (
    <MessageContent
      message={message}
      useEmojis={useEmojis}
      emojiSet={emojiSet}
      isCommand={isCommand}
      highlightWords={highlightWords}
    />
  )

  const content = useLargeMessage ? (
    // Need to wrap elements and change their ordering
    <div className="content-wrapper">
      <div className="Message__Details">
        {messageUser}
        {messageTimestamp}
      </div>
      {messageContent}
    </div>
  ) : (
    <>
      {messageTimestamp}
      {messageUser}
      {messageContent}
    </>
  )

  return (
    <IntersectObserver tag="div" onChange={onInViewChange} triggerOnce={true} className="Message">
      {useLargeMessage ? <MessageUserAvatar message={message} /> : null}
      {content}
    </IntersectObserver>
  )
}

MessageRow.propTypes = {
  message: PropTypes.object.isRequired,
  colorifyUsernames: PropTypes.bool,
  useLargeMessage: PropTypes.bool,
  useEmojis: PropTypes.bool,
  emojiSet: PropTypes.string.isRequired,
  onInViewChange: PropTypes.func.isRequired,
  highlightWords: PropTypes.array
}

MessageRow.defaultProps = {
  colorifyUsernames: true,
  useLargeMessage: false,
  useEmojis: true,
  highlightWords: []
}

export default observer(MessageRow)
