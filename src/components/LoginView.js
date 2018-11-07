'use strict'

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'

import { version } from '../../package.json'

import RootStoreContext from 'context/RootStoreContext'
import BackgroundAnimation from 'components/BackgroundAnimation'

import Logger from 'utils/logger'

import 'styles/LoginView.scss'
import 'styles/SubmitButton.scss'
import 'styles/InputField.scss'

import uportLogo from 'images/uport.png'

const logger = new Logger()

@observer
class LoginForm extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
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

  async onSubmit (e) {
    const username = this.usernameInput.current.value.trim()
    this.props.onSubmit(e, username)
  }

  onUportLogin () {}

  onInputChange () {
    const currentLength = this.usernameInput.current.value.length
    this.setState({ currentLength })
  }

  focusUsername () {
    this.usernameInput.current.focus()
  }

  render () {
    const { uiStore } = this.context
    const { t } = this.props

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
              style={{ ...uiStore.theme }}
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

class LoginView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    location: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onConfigure = this.onConfigure.bind(this)
    this.onBackgroundClick = this.onBackgroundClick.bind(this)
    this.onLogin = this.onLogin.bind(this)
    this.loginForm = React.createRef()
  }

  onConfigure () {}

  onBackgroundClick () {
    this.loginForm.current.focusUsername()
  }

  async onLogin (e, username) {
    const { sessionStore } = this.context

    e.preventDefault()

    try {
      if (username !== '') {
        await sessionStore.login({ username })
      }
    } catch (e) {
      logger.error(e)
    }
  }

  render () {
    const { sessionStore, uiStore } = this.context
    const { t, location } = this.props

    const { from } = location.state || { from: { pathname: '/' } }

    if (sessionStore.isAuthenticated) return <Redirect to={from} />

    return (
      <div className="LoginView">
        <CSSTransitionGroup
          className="header"
          transitionName="loginHeaderAnimation"
          transitionAppear={true}
          component="div"
          transitionAppearTimeout={5000}
          transitionEnterTimeout={5000}
          transitionLeaveTimeout={5000}>
          <h1>Orbit</h1>
        </CSSTransitionGroup>
        <LoginForm ref={this.loginForm} t={t} onSubmit={this.onLogin} />
        <div className="Version">
          {t('version')}: {version}
        </div>
        <button
          type="button"
          className="ConfigurationButton submitButton"
          style={{ ...uiStore.theme }}
          onClick={this.onConfigure}>
          {t('configuration')}
        </button>
        <BackgroundAnimation
          size={480}
          theme={{ ...uiStore.theme }}
          onClick={this.onBackgroundClick}
        />
      </div>
    )
  }
}

export default withNamespaces()(observer(LoginView))
