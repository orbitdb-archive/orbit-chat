'use strict'

import { action, configure, observable } from 'mobx'
import IPFS from 'ipfs'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class IpfsStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.sessionStore = this.rootStore.sessionStore
    this.settingsStore = this.rootStore.settingsStore

    this.startLoading = this.rootStore.uiStore.startLoading
    this.stopLoading = this.rootStore.uiStore.stopLoading
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
    this.stopLoading('ipfs-node:start')
  }

  @action.bound
  onStopped () {
    logger.info('ipfs node stopped')
    this.stopping = false
    this.node = null
    this.stopLoading('ipfs-node:stop')
  }

  @action.bound
  useJsIPFS () {
    const { username } = this.sessionStore
    if (this.starting || !username) return
    this.starting = true
    this.startLoading('ipfs-node:start')
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
    this.startLoading('ipfs-node:start')
    logger.debug('Activating go-ipfs node')
    this.stop()
    this.starting = false
    this.stopLoading('ipfs-node:stop')
  }

  @action.bound
  stop () {
    if (this.stopping || !this.node) return
    this.stopping = true
    this.startLoading('ipfs-node:stop')
    logger.info('Stopping ipfs node')
    this.node.once('stop', () => this.onStopped())
    this.node.stop()
  }
}
