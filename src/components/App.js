'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

import Logger from 'utils/logger'

const logger = new Logger()

@observer
class DevTools extends React.Component {
  render () {
    const { ipfsStore, uiStore, userStore, networkStore } = this.props

    return (
      <div className="App view">
        <button
          onClick={() => userStore.login({ username: 'test-user-' + Date.now() })}
          disabled={userStore.username}>
          Login
        </button>
        <button onClick={() => userStore.logout()} disabled={!userStore.username}>
          Logout
        </button>
        <button
          onClick={() => ipfsStore.useGoIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !userStore.username}>
          Use go-ipfs
        </button>
        <button
          onClick={() => ipfsStore.useJsIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !userStore.username}>
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
        Feeds: <br />
        <ul>
          {networkStore.feeds.map((e, idx) => (
            <li key={idx}>{e.address.toString()}</li>
          ))}
        </ul>
        Channels: <br />
        <ul>
          {networkStore.channelNames.map((e, idx) => (
            <li key={idx}>
              <strong>{e}</strong>
              <ul>
                {networkStore.channels[e].messages.map((m, idx) => (
                  <li key={idx}>{m.Post.content}</li>
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
  render () {
    const { ...stores } = this.props

    const devTools =
      process.env.NODE_ENV === 'development' ? (
        <div>
          <DevTools {...stores} />
        </div>
      ) : null

    return <div className="App view">{devTools}</div>
  }
}

export default hot(module)(App)
