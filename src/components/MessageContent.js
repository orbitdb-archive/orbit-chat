'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TextMessage from './TextMessage'

function MessageContent ({ message, isCommand, ...rest }) {
  let content

  switch (message.Post.meta.type) {
    case 'text':
      content = <TextMessage text={message.Post.content} {...rest} />
      break
    case 'file':
      break
    case 'directory':
      break
    default:
      content = message.Post.content
  }
  return <div className={classNames('Content', { command: isCommand })}>{content}</div>
}

MessageContent.propTypes = {
  message: PropTypes.object.isRequired,
  isCommand: PropTypes.bool
}

MessageContent.defaultProps = {
  isCommand: false
}

export default MessageContent
