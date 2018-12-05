'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import FileMessage from './FileMessage'
import TextMessage from './TextMessage'

function MessageContent ({ message, isCommand, ...rest }) {
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
          name={post.name}
          size={post.size}
          meta={post.meta}
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
  message: PropTypes.object.isRequired,
  isCommand: PropTypes.bool
}

MessageContent.defaultProps = {
  isCommand: false
}

export default MessageContent
