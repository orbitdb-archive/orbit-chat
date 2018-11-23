'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import '../styles/JoinChannel.scss'

function JoinChannel ({ t, onSubmit, theme, inputRef }) {
  return (
    <div className="JoinChannel">
      <form onSubmit={onSubmit}>
        <div className="row">
          <span className="label">#</span>
          <span className="field" style={theme}>
            <input type="text" ref={inputRef} placeholder={t('joinChannel.inputPlaceholder')} />
          </span>
        </div>
      </form>
    </div>
  )
}

JoinChannel.propTypes = {
  t: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  inputRef: PropTypes.func
}

export default JoinChannel
