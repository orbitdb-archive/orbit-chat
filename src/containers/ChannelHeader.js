'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'
import { withNamespaces } from 'react-i18next'

import RootStoreContext from '../context/RootStoreContext'

import ChannelLink from './ChannelLink'

import '../styles/ChannelHeader.scss'

setConfig({
  pureSFC: true,
  pureRender: true
})

class ChannelHeader extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  }

  render () {
    const { t, match } = this.props
    const { uiStore, networkStore } = this.context

    function onChannelClick (e) {
      // Stop propagation to Header
      e.stopPropagation()
      // No other actions needed since ChannelLink is doing the rest
    }

    function onHeaderClick (e) {
      uiStore.openControlPanel()
    }

    const {
      path,
      params: { channel: currentChannelName }
    } = match

    const otherChannels = networkStore.channelsAsArray
      .filter(c => c.name !== currentChannelName)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(c => (
        <ChannelLink
          key={c.name}
          channel={c}
          theme={{ ...uiStore.theme }}
          onClick={onChannelClick}
        />
      ))

    const overrideName = t(`viewNames.${path.slice(1)}`)

    return (
      <div className="Header" onClick={onHeaderClick}>
        <div className="ChannelName">
          <div className="currentChannel">
            <CSSTransition
              component="div"
              classNames="channelHeaderAnimation"
              enter={true}
              exit={false}
              appear={false}
              timeout={{ appear: 0, enter: 1000, exit: 0 }}
            >
              <span>{currentChannelName ? `#${currentChannelName}` : overrideName}</span>
            </CSSTransition>
          </div>
          {otherChannels}
        </div>
      </div>
    )
  }
}

export default hot(module)(withNamespaces()(observer(ChannelHeader)))
