'use strict'

import { action, configure, observable } from 'mobx'
import IPFS from 'ipfs'

import { getJsIpfsConfig } from 'config/ipfs.config'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class IpfsStore {
  constructor (rootStore) {
    this.rootStore = rootStore
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
    const { username } = this.rootStore.sessionStore
    if (this.starting || !username) return
    this.starting = true
    this.startLoading('ipfs-node:start')
    logger.info('Starting js-ipfs node')
    this.stop()
    const config = getJsIpfsConfig(window.ipfsDataDir || '/orbit/ipfs')
    const node = new IPFS(config)
    node.once('ready', () => this.onStarted(node))
  }

  @action.bound
  useGoIPFS () {
    const { username } = this.rootStore.sessionStore
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
