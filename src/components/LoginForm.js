'use strict'

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Logger from '../utils/logger'

import '../styles/SubmitButton.scss'
import '../styles/InputField.scss'

import uportLogo from '../images/uport.png'

const logger = new Logger()

function LoginForm ({ t, theme, onSubmit, setUsernameInputRef }) {
  const [currentLength, setCurrentLength] = useState(0)

  const usernameInputRef = useRef()

  useEffect(() => {
    if (typeof setUsernameInputRef === 'function') setUsernameInputRef(usernameInputRef)
    return () => {
      if (typeof setUsernameInputRef === 'function') setUsernameInputRef(null)
    }
  })

  const transitionOptions = {
    classNames: 'loginScreenAnimation',
    appear: true,
    component: 'div',
    className: 'inputs',
    timeout: {
      appear: 5000,
      enter: 5000,
      exit: 5000
    }
  }

  return (
    <form onSubmit={e => onSubmit(e, usernameInputRef.current.value.trim())}>
      <TransitionGroup>
        <CSSTransition {...transitionOptions} className="usernameRow">
          <div>
            <input
              ref={usernameInputRef}
              type="text"
              placeholder={t('login.nickname')}
              maxLength="32"
              autoFocus
              style={theme}
              onChange={() => setCurrentLength(usernameInputRef.current.value.length)}
              onClick={() => usernameInputRef.current.focus()}
            />
          </div>
        </CSSTransition>
        <CSSTransition {...transitionOptions} className="connectButtonRow">
          <div>
            <span className="hint">
              {currentLength > 0 ? t('login.pressEnterToLogin') : t('login.orLoginWith')}
            </span>
            <input type="submit" value="Connect" style={{ display: 'none' }} />
          </div>
        </CSSTransition>
        <CSSTransition {...transitionOptions} className="lastRow">
          <div>
            {currentLength === 0 ? (
              <img
                onClick={() => logger.warn('Uport Login not implemented')}
                className="logo"
                src={uportLogo}
                height="64"
              />
            ) : null}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </form>
  )
}

LoginForm.propTypes = {
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setUsernameInputRef: PropTypes.func
}

export default LoginForm
