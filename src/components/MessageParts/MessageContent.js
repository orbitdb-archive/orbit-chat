'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { FileMessage, TextMessage } from '../MessageTypes'

function MessageContent ({ isCommand, message, ...rest }) {
  let content

  const post = message.Post

  switch (post.meta.type) {
    case 'text':
      content = <TextMessage text={post.content} {...rest} />
      break
    case 'file':
      content = (
        <FileMessage
          hash={post.hash}
          meta={post.meta}
          name={post.name}
          size={post.size}
          {...rest}
        />
      )
      break
    case 'directory':
      break
    default:
      content = post.content
  }
  return <div className={classNames('Message__Content', { command: isCommand })}>{content}</div>
}

MessageContent.propTypes = {
  isCommand: PropTypes.bool,
  message: PropTypes.object.isRequired
}

MessageContent.defaultProps = {
  isCommand: false
}

export default MessageContent
