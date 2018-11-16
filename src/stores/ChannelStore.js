'use strict'

import { action, computed, configure, observable, runInAction } from 'mobx'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class ChannelStore {
  @observable
  messages = []

  @observable
  peers = []

  @observable
  loadingHistory = true

  @observable
  loadingNewMessages = false

  constructor ({ network, feed, name }) {
    this.network = network
    this.feed = feed
    this.name = name

    this.peerInterval = setInterval(this.updatePeers, 1000)

    this.feed.events.once('ready', this.onReady.bind(this))
    this.feed.events.on('error', this.onError.bind(this))
    this.feed.events.on('replicate', this.onReplicate.bind(this))
    this.feed.events.on('replicate.progress', this.onReplicateProgress.bind(this))
    this.feed.events.on('replicated', this.onReplicated.bind(this))
    this.feed.events.on('write', this.onWrite.bind(this))

    this.stop = this.stop.bind(this)
  }

  @computed
  get messageHashesAndTimestamps () {
    return this.messages.map(m => [m.Hash, m.Post.meta.ts])
  }

  @computed
  get readMessages () {
    return this.messages.filter(m => !m.unread)
  }

  @computed
  get unreadMessages () {
    return this.messages.filter(m => m.unread)
  }

  @computed
  get hasUnreadMessages () {
    return this.unreadMessages.length > 0
  }

  @computed
  get hasMentions () {
    return false
  }

  @action.bound
  updateMessages (amount) {
    const oldHashesAndTimestamps = this.messageHashesAndTimestamps
    const messages = this.getMessages(amount).map(m => {
      // Check which messages are new and flag accordingly
      oldHashesAndTimestamps.indexOf([m.Hash, m.Post.meta.ts]) === -1
        ? (m.unread = true)
        : (m.unread = false)
      return m
    })

    this.messages = messages
  }

  @action.bound
  async updatePeers () {
    const peers = await this.getPeers()
    runInAction(() => {
      this.peers = peers
    })
  }

  @action.bound
  markMessageAsRead (message) {
    message.unread = false
  }

  @action.bound
  markAllMessagesAsRead () {
    this.messages = this.messages.map(m => {
      m.unread = false
      return m
    })
  }

  @action
  onReady () {
    this.updateMessages(-1)
    this.loadingHistory = false
  }

  @action
  onReplicate () {
    this.loadingNewMessages = true
  }

  @action
  onReplicateProgress () {
    this.loadingNewMessages = true
  }

  @action
  onReplicated () {
    this.updateMessages(this.messages.length + 64)
    this.loadingNewMessages = false
  }

  @action
  onWrite (channel, logHash, message) {
    this.messages.push(this.parseMessage(message[0]))
  }

  @action
  onError (err) {
    logger.error(this.channelName, err)
    this.loadingHistory = false
    this.loadingNewMessages = false
  }

  @action.bound
  leave () {
    this.network.leaveChannel(this.name)
  }

  stop () {
    clearInterval(this.peerInterval)

    this.feed.events.removeListener('ready', this.onReady)
    this.feed.events.removeListener('error', this.onError)
    this.feed.events.removeListener('replicate', this.onReplicate)
    this.feed.events.removeListener('replicate.progress', this.onReplicateProgress)
    this.feed.events.removeListener('replicated', this.onReplicated)
    this.feed.events.removeListener('write', this.onWrite)
  }

  getMessages (amount) {
    const options = {
      limit: amount,
      lt: null,
      gte: null
    }

    return this.feed
      .iterator(options)
      .collect()
      .map(this.parseMessage)
      .filter(e => e !== undefined)
  }

  parseMessage (entry) {
    try {
      return JSON.parse(entry.payload.value)
    } catch (err) {
      logger.warn('Failed to parse payload from message:', err)
    }
  }

  getPeers () {
    return this.network.ipfs.pubsub.peers(this.feed.address.toString())
  }

  async sendMessage (text) {
    await this.network.orbit.send(this.name, text)
  }
}
