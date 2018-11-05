'use strict'

import { configure, action, observable, reaction } from 'mobx'
import Orbit from 'orbit_'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class OrbitStore {
  constructor (rootStore) {
    this.rootStore = rootStore

    this.onIpfsChanged = this.onIpfsChanged.bind(this)
    this.onUsernameChanged = this.onUsernameChanged.bind(this)

    // React to ipfs node changes
    reaction(() => this.rootStore.ipfsStore.node, this.onIpfsChanged)

    // React to user changes
    reaction(() => this.rootStore.sessionStore.username, this.onUsernameChanged)
  }

  @observable
  node = null

  @observable
  starting = false

  @observable
  stopping = false

  _username = null

  onUsernameChanged (newUsername) {
    this._username = newUsername
  }

  onIpfsChanged (ipfs) {
    this.stop()
    this.init(ipfs)
  }

  @action.bound
  onStarted (node) {
    logger.info('orbit node started')
    this.starting = false
    this.node = node
  }

  @action.bound
  onStopped () {
    logger.info('orbit node stopped')
    this.stopping = false
    this.node = null
  }

  @action.bound
  init (ipfs) {
    if (this.starting || !ipfs) return
    this.starting = true
    logger.info('Starting orbit node')
    this.stop()
    const node = new Orbit(ipfs, {})
    node.events.once('connected', () => this.onStarted(node))
    node.connect(this._username)
  }

  @action.bound
  stop () {
    if (this.stopping || !this.node) return
    this.stopping = true
    logger.info('Stopping orbit node')
    this.node.events.once('disconnected', () => this.onStopped())
    this.node.disconnect()
  }
}
