'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import Logger from '../utils/logger'

import '../styles/SubmitButton.scss'
import '../styles/InputField.scss'

import uportLogo from '../images/uport.png'

const logger = new Logger()

class LoginForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      currentLength: 0
    }

    this.focusUsername = this.focusUsername.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onUportLogin = this.onUportLogin.bind(this)
    this.onInputChange = this.onInputChange.bind(this)

    this.usernameInput = React.createRef()
  }

  onSubmit (e) {
    const username = this.usernameInput.current.value.trim()
    this.props.onSubmit(e, username)
  }

  onUportLogin () {
    logger.warn('Uport Login not implemented')
  }

  onInputChange () {
    const currentLength = this.usernameInput.current.value.length
    this.setState({ currentLength })
  }

  focusUsername () {
    this.usernameInput.current.focus()
  }

  render () {
    const { t, theme } = this.props

    return (
      <form onSubmit={this.onSubmit}>
        <CSSTransitionGroup
          transitionName="loginScreenAnimation"
          transitionAppear={true}
          component="div"
          className="inputs"
          transitionAppearTimeout={5000}
          transitionEnterTimeout={5000}
          transitionLeaveTimeout={5000}>
          <div className="usernameRow" onClick={this.focusUsername}>
            <input
              ref={this.usernameInput}
              type="text"
              placeholder={t('login.nickname')}
              maxLength="32"
              autoFocus
              style={theme}
              onChange={this.onInputChange}
            />
          </div>
          <div className="connectButtonRow">
            <span className="hint">
              {this.state.currentLength > 0 ? t('login.pressEnterToLogin') : t('login.orLoginWith')}
            </span>
            <input type="submit" value="Connect" style={{ display: 'none' }} />
          </div>
          <div className="lastRow">
            {this.state.currentLength === 0 ? (
              <img onClick={this.onUportLogin} className="logo" src={uportLogo} height="64" />
            ) : null}
          </div>
        </CSSTransitionGroup>
      </form>
    )
  }
}

export default LoginForm
