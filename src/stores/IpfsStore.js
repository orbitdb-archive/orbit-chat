'use strict'

import { action, configure, observable } from 'mobx'
import IPFS from 'ipfs'

import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class IpfsStore {
  constructor (networkStore) {
    this.sessionStore = networkStore.rootStore.sessionStore
    this.settingsStore = networkStore.rootStore.settingsStore
  }

  @observable
  node = null

  @observable
  starting = false

  @observable
  stopping = false

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
    const { username } = this.sessionStore
    if (this.starting || !username) return
    this.starting = true
    logger.info('Starting js-ipfs node')
    this.stop()
    const settings = this.settingsStore.networkSettings.ipfs
    const node = new IPFS(settings)
    node.version((err, { version }) => {
      if (err) return
      logger.info(`js-ipfs version ${version}`)
    })
    node.once('ready', () => this.onStarted(node))
  }

  @action.bound
  useGoIPFS () {
    const { username } = this.sessionStore
    if (this.starting || !username) return
    this.starting = true
    logger.debug('Activating go-ipfs node')
    this.stop()
    this.starting = false
    this.stopLoading('ipfs-node:stop')
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
