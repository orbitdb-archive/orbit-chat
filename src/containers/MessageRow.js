'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import IntersectObserver from 'react-intersection-observer'

import {
  MessageContent,
  MessageTimestamp,
  MessageUser,
  MessageUserAvatar
} from '../components/MessageParts'

import '../styles/MessageRow.scss'

function MessageRow ({
  message,
  colorifyUsernames,
  useLargeMessage,
  highlightWords,
  onInViewChange,
  onMessageUserClick,
  ...rest
}) {
  const isCommand = message.Post.content && message.Post.content.startsWith('/me')

  const messageTimestamp = <MessageTimestamp message={message} />

  const messageUser = (
    <MessageUser
      message={message}
      colorify={colorifyUsernames}
      isCommand={isCommand}
      onClick={onMessageUserClick}
    />
  )

  const messageContent = (
    <MessageContent
      message={message}
      isCommand={isCommand}
      highlightWords={highlightWords}
      animationProps={{
        transitionName: 'messageAnimation',
        transitionAppear: true,
        transitionEnter: true,
        transitionLeave: false,
        transitionAppearTimeout: 200,
        transitionEnterTimeout: 1000,
        component: 'div',
        className: 'content'
      }}
      {...rest}
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
  highlightWords: PropTypes.array,
  onInViewChange: PropTypes.func.isRequired,
  onMessageUserClick: PropTypes.func,
  loadFile: PropTypes.func.isRequired
}

MessageRow.defaultProps = {
  colorifyUsernames: true,
  useLargeMessage: false,
  useEmojis: true,
  highlightWords: []
}

export default observer(MessageRow)
