'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import IntersectObserver from 'react-intersection-observer'

import MessageTimestamp from '../components/MessageTimestamp'
import MessageUser from '../components/MessageUser'
import MessageContent from '../components/MessageContent'

import '../styles/MessageRow.scss'

function MessageRow ({
  message,
  colorifyUsernames,
  useEmojis,
  emojiSet,
  onInViewChange,
  highlightWords
}) {
  const isCommand = message.Post.content && message.Post.content.startsWith('/me')

  return (
    <IntersectObserver tag="div" onChange={onInViewChange} triggerOnce={true} className="Message">
      <MessageTimestamp message={message} />
      <MessageUser message={message} colorify={colorifyUsernames} isCommand={isCommand} />
      <MessageContent
        message={message}
        useEmojis={useEmojis}
        emojiSet={emojiSet}
        isCommand={isCommand}
        highlightWords={highlightWords}
      />
    </IntersectObserver>
  )
}

MessageRow.propTypes = {
  message: PropTypes.object.isRequired,
  colorifyUsernames: PropTypes.bool,
  useEmojis: PropTypes.bool,
  emojiSet: PropTypes.string.isRequired,
  onInViewChange: PropTypes.func.isRequired,
  highlightWords: PropTypes.array
}

MessageRow.defaultProps = {
  colorifyUsernames: true,
  useEmojis: true,
  highlightWords: []
}

export default observer(MessageRow)
