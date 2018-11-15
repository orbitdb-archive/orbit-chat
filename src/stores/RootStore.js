'use strict'

import IpfsStore from './IpfsStore'
import NetworkStore from './NetworkStore'
import OrbitStore from './OrbitStore'
import UiStore from './UiStore'
import SessionStore from './SessionStore'
import SettingsStore from './SettingsStore'

export default class RootStore {
  constructor (i18n) {
    // The ordering matters
    this.i18n = i18n
    this.sessionStore = new SessionStore(this)
    this.settingsStore = new SettingsStore(this)
    this.uiStore = new UiStore(this)
    this.ipfsStore = new IpfsStore(this)
    this.orbitStore = new OrbitStore(this)
    this.networkStore = new NetworkStore(this)
  }
}
