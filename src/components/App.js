'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

import RootStoreContext from 'context/RootStoreContext'

import BackgroundAnimation from 'components/BackgroundAnimation'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

@observer
class DebugChannelList extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { networkStore } = this.context
    return (
      <div>
        Channels: <br />
        <ul>
          {networkStore.channelsAsArray.map(channel => (
            <li key={channel.name}>
              <strong>Channel name: {channel.name}</strong> <br />
              <strong>Peers: {channel.peers.length}</strong> <br />
              <button
                disabled={channel.unreadMessages.length === 0}
                onClick={channel.markAllMessagesAsRead}>
                Mark read
              </button>
              <ul>
                {channel.messages.map((m, idx) => (
                  <li key={idx}>
                    {m.Post.content}
                    {m.unread ? '*NEW*' : ''}
                    {m.unread ? (
                      <button
                        onClick={() => {
                          channel.markMessageAsRead(m)
                        }}>
                        R
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

@observer
class DebugControlButtons extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { ipfsStore, sessionStore, networkStore } = this.context

    return (
      <div>
        <button
          onClick={() => sessionStore.login({ username: 'test-user-' + Date.now() })}
          disabled={sessionStore.username}>
          Login
        </button>
        <button onClick={() => sessionStore.logout()} disabled={!sessionStore.username}>
          Logout
        </button>
        <br />
        <button
          onClick={() => ipfsStore.useGoIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !sessionStore.username}>
          Use go-ipfs
        </button>
        <button
          onClick={() => ipfsStore.useJsIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !sessionStore.username}>
          Use js-ipfs
        </button>
        <button onClick={() => networkStore.stop()} disabled={!networkStore.running}>
          Stop
        </button>
        <br />
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('testing') !== -1}
          onClick={() => networkStore.joinChannel('testing')}>
          Join testing
        </button>
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('testing') === -1}
          onClick={() => networkStore.leaveChannel('testing')}>
          Leave testing
        </button>
        <br />
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('testing2') !== -1}
          onClick={() => networkStore.joinChannel('testing2')}>
          Join testing2
        </button>
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('testing2') === -1}
          onClick={() => networkStore.leaveChannel('testing2')}>
          Leave testing2
        </button>
        <br />
      </div>
    )
  }
}
@observer
class DevTools extends React.Component {
  static contextType = RootStoreContext

  render () {
    return (
      <div>
        <DebugControlButtons />
        <br />
        <br />
        <DebugChannelList />
      </div>
    )
  }
}

@observer
class App extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { uiStore } = this.context

    const devTools =
      process.env.NODE_ENV === 'development' ? (
        <div>
          <DevTools />
          <MobxDevTools />
        </div>
      ) : null

    return (
      <div className="App view">
        <BackgroundAnimation
          size={uiStore.windowDimensions.width / 1.5}
          circleSize={2}
          style={{ opacity: 0.8, zIndex: -1 }}
        />
        {devTools}
      </div>
    )
  }
}

export default hot(module)(App)
