'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import createColor from '../utils/create-color'

function MessageUser ({ message, colorify, isCommand }) {
  const user = message.Post.meta.from
  const color = colorify && user ? createColor(user.name) : 'rgb(250, 250, 250)'

  return (
    <div className={classNames('User', { command: isCommand })} style={{ color }}>
      {user ? user.name : ''}
    </div>
  )
}

MessageUser.propTypes = {
  message: PropTypes.object.isRequired,
  colorify: PropTypes.bool,
  isCommand: PropTypes.bool
}

MessageUser.defaultProps = {
  colorify: false,
  isCommand: false
}

export default MessageUser
