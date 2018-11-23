'use strict'

import { action, computed, configure, observable, reaction, runInAction, values } from 'mobx'

import { throttleFunc } from '../utils/throttle'
import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class ChannelStore {
  @observable
  messages = []

  @observable
  peers = []

  @observable
  loadingHistory = false

  @observable
  loadingNewMessages = false

  @observable
  sendingMessage = false

  @observable
  storableState = {}

  sendQueue = []
  sending = false

  loadBatch = []
  replicationBatch = []

  constructor ({ network, feed, name }) {
    this.network = network
    this.feed = feed
    this.name = name

    this.stop = this.stop.bind(this)
    this.processSendQueue = throttleFunc(this.processSendQueue.bind(this))
    this.saveState = this.saveState.bind(this)

    this.peerInterval = setInterval(this.updatePeers, 1000)
    this.processSendQueueInterval = setInterval(this.processSendQueue, 10)

    this.feed.events.on('error', this.onError.bind(this))
    this.feed.events.on('load.progress', this.onLoadProgress.bind(this))
    this.feed.events.on('ready', this.onLoaded.bind(this))
    this.feed.events.on('replicate.progress', this.onReplicateProgress.bind(this))
    this.feed.events.on('replicated', this.onReplicated.bind(this))
    this.feed.events.on('write', this.onWrite.bind(this))

    this.loadState()

    this.feed.load()

    // Save channel state on changes
    reaction(() => values(this.storableState), this.saveState)
  }

  @computed
  get messageHashes () {
    return this.messages.map(m => m.Hash)
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

  get storagekey () {
    const username = this.network.session.username
    if (!username) throw new Error('No logged in user')
    return `orbit-chat.${username}.channel-states`
  }

  @action.bound
  updateMessages (messages) {
    const oldHashes = this.messageHashes
    const { lastReadTimestamp = 0 } = this.storableState

    const newMessages = messages
      // Filter out messages we already have
      .filter(m => oldHashes.indexOf(m.Hash) === -1)
      // Set messages as unread
      .map(m => Object.assign(m, { unread: m.Post.meta.ts > lastReadTimestamp }))

    this.messages = this.messages
      .concat(newMessages)
      .sort((a, b) => a.Post.meta.ts - b.Post.meta.ts)
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

    // Check if we need to update the last read timestamp
    const { lastReadTimestamp } = this.storableState
    if (!lastReadTimestamp || message.Post.meta.ts > lastReadTimestamp) {
      this.storableState.lastReadTimestamp = message.Post.meta.ts
    }
  }

  @action.bound
  markAllMessagesAsRead () {
    this.messages = this.messages.map(this.markMessageAsRead)
  }

  @action // Called while loading from local filesystem
  onLoadProgress (...args) {
    const entry = this.parseMessage(args[2])
    this.loadBatch.push(entry)
    this.loadingHistory = true
  }

  @action // Called when done loading from local filesystem
  onLoaded () {
    const messages = this.loadBatch.filter(e => e)
    this.loadBatch = []
    this.updateMessages(messages)
    this.loadingHistory = false
  }

  @action // Called while loading from IPFS (receiving new messages)
  onReplicateProgress (...args) {
    const entry = this.parseMessage(args[2])
    this.replicationBatch.push(entry)
    this.loadingNewMessages = true
  }

  @action // Called when done loading from IPFS
  onReplicated () {
    const messages = this.replicationBatch.filter(e => e)
    this.replicationBatch = []
    this.updateMessages(messages)
    this.loadingNewMessages = false
  }

  @action // Called when the user writes a message
  onWrite (...args) {
    this.updateMessages([this.parseMessage(args[2][0])])
    this.sendingMessage = false
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
    clearInterval(this.processSendQueueInterval)

    this.feed.events.removeListener('error', this.onError)
    this.feed.events.removeListener('load.progress', this.onLoadProgress)
    this.feed.events.removeListener('ready', this.onLoaded)
    this.feed.events.removeListener('replicate.progress', this.onReplicateProgress)
    this.feed.events.removeListener('replicated', this.onReplicated)
    this.feed.events.removeListener('write', this.onWrite)
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

  @action.bound
  sendMessage (text) {
    this.sendingMessage = true

    // TODO: fix the compatibility issue here (exlcude incompatible browsers)
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
      this.sendQueue.push({ text, resolve, reject })
    })
  }

  async processSendQueue () {
    if (this.sendQueue.length === 0 || this.sending) return

    this.sending = true
    const task = this.sendQueue.shift()

    try {
      const r = await this.network.orbit.send(this.name, task.text)
      task.resolve(r)
    } catch (e) {
      task.reject(e)
    }

    this.sending = false
  }

  getStoredStates () {
    return JSON.parse(localStorage.getItem(this.storagekey)) || {}
  }

  @action.bound
  loadState () {
    try {
      Object.assign(this.storableState, this.getStoredStates()[this.name] || {})
    } catch (err) {}
  }

  saveState () {
    try {
      const states = Object.assign(this.getStoredStates(), { [this.name]: this.storableState })
      localStorage.setItem(this.storagekey, JSON.stringify(states))
    } catch (err) {}
  }
}
