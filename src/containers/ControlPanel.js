'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import RootStoreContext from 'context/RootStoreContext'

import ChannelLink from 'components/ChannelLink'

import BackgroundAnimation from 'components/BackgroundAnimation'
import JoinChannel from 'components/JoinChannel'

import 'styles/flaticon.css'
import 'styles/ControlPanel.scss'

class ControlPanel extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onClose = this.onClose.bind(this)
    this.onJoinChannel = this.onJoinChannel.bind(this)
  }

  onClose () {
    const { uiStore } = this.context
    if (!uiStore.currentChannelName) return
    uiStore.closeControlPanel()
  }

  onJoinChannel (e) {
    e.preventDefault()
    if (!this.joinChannelInput) return
    const { networkStore } = this.context
    const channel = this.joinChannelInput.value.trim()
    networkStore.joinChannel(channel).then(() => {
      this.joinChannelInput.value = ''
    })
  }

  render () {
    const { networkStore, sessionStore, uiStore } = this.context
    const { t } = this.props

    const leftSide = uiStore.leftSidePanel

    const transitionProps = {
      component: 'div',
      transitionAppear: true,
      transitionAppearTimeout: 5000,
      transitionEnterTimeout: 5000,
      transitionLeaveTimeout: 5000
    }

    const channels = networkStore.channelsAsArray.sort((a, b) => a.name.localeCompare(b.name))

    return (
      <React.Fragment>
        <CSSTransitionGroup
          {...transitionProps}
          transitionName={leftSide ? 'openPanelAnimationLeft' : 'openPanelAnimationRight'}>
          <div
            className={classNames('ControlPanel', {
              left: leftSide,
              right: !leftSide,
              'no-close': !uiStore.currentChannelName
            })}>
            <div style={{ opacity: 0.8, zIndex: -1 }}>
              <BackgroundAnimation
                size={320}
                startY={58}
                theme={{ ...uiStore.theme }}
                style={{ alignItems: 'flex-start' }}
              />
            </div>
            <CSSTransitionGroup
              {...transitionProps}
              transitionName={leftSide ? 'panelHeaderAnimationLeft' : 'panelHeaderAnimationRight'}>
              <div className="header" onClick={this.onClose}>
                <div className="logo">Orbit</div>
              </div>
            </CSSTransitionGroup>

            <CSSTransitionGroup {...transitionProps} transitionName="networkNameAnimation">
              <div className="networkName">
                <div className="text">{networkStore.networkName}</div>
              </div>
            </CSSTransitionGroup>

            <div className="username">{sessionStore.username}</div>

            {networkStore.isOnline ? (
              <CSSTransitionGroup
                {...transitionProps}
                transitionName="joinChannelAnimation"
                className="joinChannelInput">
                <JoinChannel
                  onSubmit={this.onJoinChannel}
                  // requirePassword={this.state.requirePassword}
                  theme={{ ...uiStore.theme }}
                  t={t}
                  inputRef={el => (this.joinChannelInput = el)}
                />
              </CSSTransitionGroup>
            ) : null}

            <div
              className={classNames({
                panelHeader: channels.length > 0,
                hidden: channels.length === 0
              })}>
              {t('controlPanel.channels')}
            </div>

            <CSSTransitionGroup
              {...transitionProps}
              transitionName="joinChannelAnimation"
              className="openChannels">
              <div className="RecentChannelsView">
                <div className="RecentChannels">
                  {channels.map(c => (
                    <div className="row link" key={c.name}>
                      <ChannelLink
                        channel={c}
                        theme={{ ...uiStore.theme }}
                        onClick={this.onClose}
                      />
                      <span className="closeChannelButton" onClick={c.leave}>
                        {t('controlPanel.closeChannel')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CSSTransitionGroup>

            <div className="bottomRow">
              <div
                className="icon flaticon-gear94"
                // onClick={this.props.onOpenSettings}
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
                // onClick={this.props.onDisconnect}
                style={{ ...uiStore.theme }}
                key="disconnectIcon"
              />
            </div>
          </div>
        </CSSTransitionGroup>
        <CSSTransitionGroup
          {...transitionProps}
          transitionName="darkenerAnimation"
          className={classNames('darkener', { 'no-close': !uiStore.currentChannelName })}
          onClick={this.onClose}
        />
      </React.Fragment>
    )
  }
}

export default withNamespaces()(observer(ControlPanel))
