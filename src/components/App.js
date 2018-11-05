'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

import RootStoreContext from 'context/RootStoreContext'

@observer
class DevTools extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { ipfsStore, uiStore, sessionStore, networkStore } = this.context

    return (
      <div className="App view">
        <span>
          Width: {uiStore.windowDimensions.width}, height: {uiStore.windowDimensions.height}
        </span>
        <br />
        <button
          onClick={() => sessionStore.login({ username: 'test-user-' + Date.now() })}
          disabled={sessionStore.username}>
          Login
        </button>
        <button onClick={() => sessionStore.logout()} disabled={!sessionStore.username}>
          Logout
        </button>
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
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('tislaamo') !== -1}
          onClick={() => networkStore.joinChannel('tislaamo')}>
          Join tislaamo
        </button>
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('tislaamo') === -1}
          onClick={() => networkStore.leaveChannel('tislaamo')}>
          Leave tislaamo
        </button>
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('tislaamo2') !== -1}
          onClick={() => networkStore.joinChannel('tislaamo2')}>
          Join tislaamo2
        </button>
        <button
          disabled={!networkStore.running || networkStore.channelNames.indexOf('tislaamo2') === -1}
          onClick={() => networkStore.leaveChannel('tislaamo2')}>
          Leave tislaamo2
        </button>
        <button onClick={() => networkStore.stop()} disabled={!networkStore.running}>
          Stop
        </button>
        <br />
        <br />
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
        <MobxDevTools />
      </div>
    )
  }
}

@observer
class App extends React.Component {
  static propTypes = {}

  render () {
    const devTools =
      process.env.NODE_ENV === 'development' ? (
        <div>
          <DevTools />
        </div>
      ) : null

    return <div className="App view">{devTools}</div>
  }
}

export default hot(module)(App)
