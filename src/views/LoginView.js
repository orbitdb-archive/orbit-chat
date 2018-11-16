'use strict'

import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import { CSSTransitionGroup } from 'react-transition-group'

import { version } from '../../package.json'

import RootStoreContext from 'context/RootStoreContext'

import BackgroundAnimation from 'components/BackgroundAnimation'
import LoginForm from 'components/LoginForm'

import Logger from 'utils/logger'

import 'styles/LoginView.scss'

const logger = new Logger()

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

  onConfigure () {
    logger.warn('Settings view not implemented')
  }

  onBackgroundClick () {
    this.loginForm.current.focusUsername()
  }

  onLogin (e, username) {
    const { sessionStore } = this.context

    e.preventDefault()

    if (username !== '') {
      sessionStore.login({ username }).catch(e => {
        logger.error(e)
      })
    }
  }

  render () {
    const { sessionStore, uiStore } = this.context
    const { t, location } = this.props

    const { from } = location.state || { from: { pathname: '/' } }

    if (sessionStore.isAuthenticated) return <Redirect to={from} />

    uiStore.setTitle('Login | Orbit')

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
        <LoginForm
          ref={this.loginForm}
          onSubmit={this.onLogin}
          t={t}
          theme={{ ...uiStore.theme }}
        />
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
