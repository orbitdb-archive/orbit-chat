'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

import RootStoreContext from '../context/RootStoreContext'

import BackgroundAnimation from '../components/BackgroundAnimation'
import JoinChannel from '../components/JoinChannel'
import Spinner from '../components/Spinner'

import ChannelLink from './ChannelLink'

import '../styles/flaticon.css'
import '../styles/ControlPanel.scss'

setConfig({
  pureSFC: true,
  pureRender: true
})

class ControlPanel extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  state = { redirectTo: null }

  constructor (props) {
    super(props)
    this.onClose = this.onClose.bind(this)
    this.onJoinChannel = this.onJoinChannel.bind(this)
    this.redirect = this.redirect.bind(this)
    this.isClosable = this.isClosable.bind(this)
    this.renderJoinChannelInput = this.renderJoinChannelInput.bind(this)
    this.renderChannelsList = this.renderChannelsList.bind(this)
    this.renderBottomRow = this.renderBottomRow.bind(this)
  }

  componentDidMount () {
    this.focusJoinChannelInput()
  }

  componentDidUpdate () {
    this.focusJoinChannelInput()
  }

  focusJoinChannelInput () {
    if (this.joinChannelInput) this.joinChannelInput.focus()
  }

  onClose () {
    if (!this.isClosable()) return
    this.context.uiStore.closeControlPanel()
  }

  onJoinChannel (e) {
    e.preventDefault()
    if (!this.joinChannelInput) return
    const { networkStore } = this.context
    const channel = this.joinChannelInput.value.trim()
    networkStore.joinChannel(channel).then(() => {
      this.joinChannelInput.value = ''
      this.redirect(`/channel/${channel}`)
    })
  }

  isClosable () {
    const {
      history: {
        location: { pathname }
      }
    } = this.props

    return pathname !== '/'
  }

  redirect (to) {
    this.setState({ redirectTo: to }, () => {
      // Reset the state so we will not continue to redirect after one redirect
      // since this component is always mounted
      this.setState({ redirectTo: null }, () => {
        // Remember to close the panel
        this.onClose()
      })
    })
  }

  renderJoinChannelInput (transitionProps) {
    const { networkStore, uiStore } = this.context
    const { t } = this.props

    return networkStore.isOnline ? (
      <CSSTransition
        {...transitionProps}
        classNames="joinChannelAnimation"
        className="joinChannelInput"
      >
        <JoinChannel
          onSubmit={this.onJoinChannel}
          autoFocus
          // requirePassword={this.state.requirePassword}
          theme={{ ...uiStore.theme }}
          t={t}
          inputRef={el => (this.joinChannelInput = el)}
        />
      </CSSTransition>
    ) : !networkStore.starting ? (
      <button
        className="startIpfsButton submitButton"
        style={{ ...uiStore.theme }}
        onClick={() => networkStore.useJsIPFS()}
      >
        {t('controlPanel.startJsIpfs')}
      </button>
    ) : (
      <div style={{ position: 'relative' }}>
        <Spinner />
      </div>
    )
  }

  renderChannelsList (channels) {
    const { uiStore } = this.context
    const { t } = this.props

    return (
      <div className="RecentChannelsView">
        <div className="RecentChannels">
          {channels.map(c => (
            <div
              className={classNames('row link', {
                active: uiStore.currentChannelName === c.name
              })}
              key={c.name}
            >
              <ChannelLink
                channel={c}
                theme={{ ...uiStore.theme }}
                onClick={e => {
                  e.preventDefault()
                  this.redirect(`/channel/${c.name}`)
                }}
              />
              <span
                className="closeChannelButton"
                onClick={() => {
                  if (uiStore.currentChannelName === c.name) this.redirect('/')
                  c.leave()
                }}
              >
                {t('controlPanel.closeChannel')}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderBottomRow () {
    const { sessionStore, uiStore } = this.context

    return (
      <div className="bottomRow">
        <div
          className="icon flaticon-gear94"
          onClick={() => this.redirect('/settings')}
          style={{ ...uiStore.theme }}
          key="settingsIcon"
        />
        <div
          className="icon flaticon-sharing7"
          // onClick={this.props.onOpenSwarmView}
          style={{ ...uiStore.theme }}
          key="swarmIcon"
        />
        <div
          className="icon flaticon-prohibition35"
          onClick={() => sessionStore.logout()}
          style={{ ...uiStore.theme }}
          key="disconnectIcon"
        />
      </div>
    )
  }

  render () {
    const { redirectTo } = this.state
    if (redirectTo) return <Redirect to={redirectTo} />

    const { networkStore, sessionStore, uiStore } = this.context

    if (!uiStore.isControlPanelOpen) return null

    const { t } = this.props

    const leftSide = uiStore.sidePanelPosition === 'left'

    const transitionProps = {
      component: 'div',
      appear: true,
      timeout: { appear: 5000, enter: 5000, exit: 5000 }
    }

    const channels = networkStore.channelsAsArray.sort((a, b) => a.name.localeCompare(b.name))

    return (
      <React.Fragment>
        <CSSTransition
          {...transitionProps}
          classNames={leftSide ? 'openPanelAnimationLeft' : 'openPanelAnimationRight'}
          className={classNames('ControlPanel', {
            left: leftSide,
            right: !leftSide,
            'no-close': !this.isClosable()
          })}
        >
          <div>
            <div style={{ opacity: 0.8, zIndex: -1 }}>
              <BackgroundAnimation
                size={320}
                startY={58}
                theme={{ ...uiStore.theme }}
                style={{ alignItems: 'flex-start' }}
              />
            </div>
            <CSSTransition
              {...transitionProps}
              classNames={leftSide ? 'panelHeaderAnimationLeft' : 'panelHeaderAnimationRight'}
              className="header"
              onClick={this.onClose}
            >
              <div>
                <div className="logo">Orbit</div>
              </div>
            </CSSTransition>

            <CSSTransition
              {...transitionProps}
              classNames="networkNameAnimation"
              className="networkName"
            >
              <div>
                <div className="text">{networkStore.networkName}</div>
              </div>
            </CSSTransition>

            <div className="username">{sessionStore.username}</div>

            {this.renderJoinChannelInput(transitionProps)}

            <div
              className={classNames({
                panelHeader: channels.length > 0,
                hidden: channels.length === 0
              })}
            >
              {t('controlPanel.channels')}
            </div>

            <CSSTransition
              {...transitionProps}
              classNames="joinChannelAnimation"
              className="openChannels"
            >
              {this.renderChannelsList(channels)}
            </CSSTransition>

            {this.renderBottomRow()}
          </div>
        </CSSTransition>
        <CSSTransition
          {...transitionProps}
          classNames="darkenerAnimation"
          className={classNames('darkener', { 'no-close': !this.isClosable() })}
          onClick={this.onClose}
          component="div"
        >
          <div />
        </CSSTransition>
      </React.Fragment>
    )
  }
}

export default hot(module)(withNamespaces()(observer(ControlPanel)))
