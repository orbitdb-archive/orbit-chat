'use strict'

import IpfsStore from './IpfsStore'
import NetworkStore from './NetworkStore'
import OrbitStore from './OrbitStore'
import UiStore from './UiStore'
import SessionStore from './SessionStore'
import SettingsStore from './SettingsStore'

export default class RootStore {
  constructor () {
    // The ordering matters
    this.sessionStore = new SessionStore(this)
    this.settingsStore = new SettingsStore(this)
    this.uiStore = new UiStore(this)
    this.ipfsStore = new IpfsStore(this)
    this.orbitStore = new OrbitStore(this)
    this.networkStore = new NetworkStore(this)
  }
}
