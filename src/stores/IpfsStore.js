'use strict'

import { configure, action, observable, reaction } from 'mobx'
import IPFS from 'ipfs'

import { getJsIpfsConfig } from 'config/ipfs.config'
import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class IpfsStore {
  constructor (rootStore) {
    this.rootStore = rootStore

    this.onUsernameChanged = this.onUsernameChanged.bind(this)

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

  @action.bound
  onStarted (node) {
    logger.info('ipfs node started')
    this.starting = false
    this.node = node
  }

  @action.bound
  onStopped () {
    logger.info('ipfs node stopped')
    this.stopping = false
    this.node = null
  }

  @action.bound
  useJsIPFS () {
    if (this.starting || !this._username) return
    this.starting = true
    logger.info('Starting js-ipfs node')
    this.stop()
    const config = getJsIpfsConfig(window.ipfsDataDir || '/orbit/ipfs')
    const node = new IPFS(config)
    node.once('ready', () => this.onStarted(node))
  }

  @action.bound
  useGoIPFS () {
    if (this.starting || !this._username) return
    this.starting = true
    logger.debug('Activating go-ipfs node')
    this.stop()
    this.starting = false
  }

  @action.bound
  stop () {
    if (this.stopping || !this.node) return
    this.stopping = true
    logger.info('Stopping ipfs node')
    this.node.once('stop', () => this.onStopped())
    this.node.stop()
  }
}
