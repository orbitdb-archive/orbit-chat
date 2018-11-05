'use strict'

import IpfsStore from './IpfsStore'
import NetworkStore from './NetworkStore'
import OrbitStore from './OrbitStore'
import UiStore from './UiStore'
import SessionStore from './SessionStore'

export default class RootStore {
  constructor () {
    // The ordering matters
    this.uiStore = new UiStore(this)
    this.sessionStore = new SessionStore(this)
    this.ipfsStore = new IpfsStore(this)
    this.orbitStore = new OrbitStore(this)
    this.networkStore = new NetworkStore(this)
  }
}
