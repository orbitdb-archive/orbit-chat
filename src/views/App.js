'use strict'

import React from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

import RootStoreContext from 'context/RootStoreContext'

import ChannelView from 'views/ChannelView'
import LoadingView from 'views/LoadingView'
import LoginView from 'views/LoginView'

import BackgroundAnimation from 'components/BackgroundAnimation'
import PrivateRoute from 'components/PrivateRoute'

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
              <button onClick={() => channel.leave()}>Leave</button>
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
        <button onClick={() => networkStore.stop()} disabled={!networkStore.isOnline}>
          Stop
        </button>
        <br />
        <Link to="/channel/test1">
          <button>Channel test1</button>
        </Link>
        <Link to="/channel/test2">
          <button>Channel test2</button>
        </Link>
        <Link to="/channel/test3">
          <button>Channel test3</button>
        </Link>
        <br />
        <br />

        <button
          disabled={uiStore.themeName === 'Default'}
          onClick={() => (uiStore.themeName = 'Default')}>
          Set default theme
        </button>
        <button
          disabled={uiStore.themeName === 'Green'}
          onClick={() => (uiStore.themeName = 'Green')}>
          Set green theme
        </button>
        <button
          disabled={uiStore.themeName === 'Blue1'}
          onClick={() => (uiStore.themeName = 'Blue1')}>
          Set blue theme
        </button>

        <br />

        <button disabled={uiStore.language === 'en'} onClick={() => (uiStore.language = 'en')}>
          Set locale to EN
        </button>
        <button disabled={uiStore.language === 'fi'} onClick={() => (uiStore.language = 'fi')}>
          Set locale to FI
        </button>

        <br />

        <button
          disabled={uiStore.colorifyUsernames}
          onClick={() => (uiStore.colorifyUsernames = true)}>
          Set colorifyUsernames to true
        </button>
        <button
          disabled={!uiStore.colorifyUsernames}
          onClick={() => (uiStore.colorifyUsernames = false)}>
          Set colorifyUsernames to false
        </button>

        <br />

        <button disabled={uiStore.useEmojis} onClick={() => (uiStore.useEmojis = true)}>
          Set useEmojis to true
        </button>
        <button disabled={!uiStore.useEmojis} onClick={() => (uiStore.useEmojis = false)}>
          Set useEmojis to false
        </button>

        <br />

        <button
          disabled={uiStore.emojiSet === 'emojione'}
          onClick={() => (uiStore.emojiSet = 'emojione')}>
          Set emojiSet to emojione
        </button>
        <button
          disabled={uiStore.emojiSet === 'google'}
          onClick={() => (uiStore.emojiSet = 'google')}>
          Set emojiSet to google
        </button>
        <button
          disabled={uiStore.emojiSet === 'apple'}
          onClick={() => (uiStore.emojiSet = 'apple')}>
          Set emojiSet to apple
        </button>
        <br />
        <button
          disabled={uiStore.emojiSet === 'facebook'}
          onClick={() => (uiStore.emojiSet = 'facebook')}>
          Set emojiSet to facebook
        </button>
        <button
          disabled={uiStore.emojiSet === 'twitter'}
          onClick={() => (uiStore.emojiSet = 'twitter')}>
          Set emojiSet to twitter
        </button>

        <br />

        <button disabled={uiStore.useLargeMessage} onClick={() => (uiStore.useLargeMessage = true)}>
          Set useLargeMessage to true
        </button>
        <button
          disabled={!uiStore.useLargeMessage}
          onClick={() => (uiStore.useLargeMessage = false)}>
          Set useLargeMessage to false
        </button>

        <br />

        <button
          disabled={uiStore.useMonospaceFont}
          onClick={() => (uiStore.useMonospaceFont = true)}>
          Set useMonospaceFont to true
        </button>
        <button
          disabled={!uiStore.useMonospaceFont}
          onClick={() => (uiStore.useMonospaceFont = false)}>
          Set useMonospaceFont to false
        </button>

        <br />
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
        {networkStore.isOnline ? <DebugChannelList /> : null}
      </div>
    )
  }
}

@observer
class DefaultView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { uiStore } = this.context

    uiStore.setTitle('Orbit')

    return (
      <div>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} />
      </div>
    )
  }
}

class App extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { sessionStore, uiStore } = this.context

    const devTools =
      process.env.NODE_ENV === 'development' ? (
        <div className="devtools">
          <DevTools />
          <MobxDevTools />
        </div>
      ) : null

    if (uiStore.loading) return <LoadingView />

    return (
      <div className="App view">
        <Switch>
          <Route exact path="/connect" component={LoginView} />

          <PrivateRoute
            path="/channel/:channel"
            loginPath={'/connect'}
            isAuthenticated={sessionStore.isAuthenticated}
            component={ChannelView}
          />

          <PrivateRoute
            loginPath={'/connect'}
            isAuthenticated={sessionStore.isAuthenticated}
            component={DefaultView}
          />
        </Switch>
        {devTools}
      </div>
    )
  }
}

export default hot(module)(observer(App))
