'use strict'

import React from 'react'
import { Route } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

import RootStoreContext from 'context/RootStoreContext'
import Themes from 'themes'

import PrivateRoute from 'components/PrivateRoute'

import LoginView from 'components/LoginView'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

import 'styles/DevTools.scss'

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
              <strong>Messages: </strong>
              <button
                disabled={channel.unreadMessages.length === 0}
                onClick={channel.markAllMessagesAsRead}>
                Mark all as read
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
    const { ipfsStore, sessionStore, networkStore, uiStore } = this.context

    return (
      <div>
        <button
          onClick={() => sessionStore.login({ username: 'test-user-' + Date.now() })}
          disabled={sessionStore.isAuthenticated}>
          Login
        </button>
        <button onClick={() => sessionStore.logout()} disabled={!sessionStore.isAuthenticated}>
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
        <br />
        <button onClick={() => uiStore.setTheme(Themes.Default)}>Set default theme</button>
        <button onClick={() => uiStore.setTheme(Themes.Green)}>Set green theme</button>
        <button onClick={() => uiStore.setTheme(Themes.Blue1)}>Set green blue</button>
        <br />
        <br />
        <button onClick={() => uiStore.changeLanguage('en')}>Set locale to EN</button>
        <button onClick={() => uiStore.changeLanguage('fi')}>Set locale to FI</button>
        <br />
      </div>
    )
  }
}
@observer
class DevTools extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { networkStore } = this.context
    return (
      <div>
        <DebugControlButtons />
        <br />
        <br />
        {networkStore.running ? <DebugChannelList /> : null}
      </div>
    )
  }
}

class AppView extends React.Component {
  render () {
    return <div>APP VIEW</div>
  }
}

class App extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { sessionStore } = this.context

    const devTools =
      process.env.NODE_ENV === 'development' ? (
        <div className="devtools">
          <DevTools />
          <MobxDevTools />
        </div>
      ) : null

    return (
      <div className="App view">
        <PrivateRoute
          exact
          path="/"
          loginPath={'/connect'}
          isAuthenticated={sessionStore.isAuthenticated}
          component={AppView}
        />
        <Route path="/connect" component={LoginView} />
        {devTools}
      </div>
    )
  }
}

export default hot(module)(observer(App))
