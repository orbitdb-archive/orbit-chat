'use strict'

import { action, configure, observable, reaction } from 'mobx'
import Orbit from 'orbit_'

import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class OrbitStore {
  constructor (networkStore) {
    this.networkStore = networkStore
    this.sessionStore = networkStore.rootStore.sessionStore
    this.settingsStore = networkStore.rootStore.settingsStore

    this.onIpfsChanged = this.onIpfsChanged.bind(this)

    // React to ipfs node changes
    reaction(() => this.networkStore.ipfsStore.node, this.onIpfsChanged)
  }

  @observable
  node = null

  @observable
  starting = false

  @observable
  stopping = false

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
    const settings = this.settingsStore.networkSettings.orbit
    const options = {
      dbOptions: {
        directory: `${settings.root}/data/orbit-db`
      },
      channelOptions: {}
    }
    const node = new Orbit(ipfs, options)
    node.events.once('connected', () => this.onStarted(node))
    node.connect(this.sessionStore.username)
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
