'use strict'

import { action, computed, configure, observable, reaction, runInAction, values } from 'mobx'

import { throttleFunc } from '../utils/throttle'
import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class ChannelStore {
  constructor ({ network, feed, name }) {
    this.network = network
    this.feed = feed
    this.name = name

    this.leave = this.leave.bind(this)
    this.parseMessage = this.parseMessage.bind(this)
    this.stop = this.stop.bind(this)

    this._processSendQueue = throttleFunc(this._processSendQueue.bind(this))
    this._saveState = this._saveState.bind(this)

    this.peerInterval = setInterval(this._updatePeers, 1000)
    this.processSendQueueInterval = setInterval(this._processSendQueue, 10)

    this.feed.events.on('error', this._onError.bind(this))
    this.feed.events.on('load.progress', this._onLoadProgress.bind(this))
    this.feed.events.on('ready', this._onLoaded.bind(this))
    this.feed.events.on('replicate.progress', this._onReplicateProgress.bind(this))
    this.feed.events.on('replicated', this._onReplicated.bind(this))
    this.feed.events.on('write', this._onWrite.bind(this))

    this._loadState()

    this.feed.load()

    // Save channel state on changes
    reaction(() => values(this._storableState), this._saveState)
  }

  // Private instance variables

  @observable
  _storableState = {}

  _sendQueue = []
  _sending = false

  @observable
  _sendingMessageCounter = 0

  _loadBatch = []
  _replicationBatch = []

  // Public instance variables

  @observable
  messages = []

  @observable
  peers = []

  @observable
  loadingHistory = false

  @observable
  loadingNewMessages = false

  // Public instance getters

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

  @computed
  get sendingMessage () {
    return this._sendingMessageCounter > 0
  }

  @computed
  get storagekey () {
    const username = this.network.session.username
    if (!username) throw new Error('No logged in user')
    return `orbit-chat.${username}.channel-states`
  }

  // Private instance actions

  @action.bound
  _updateMessages (messages) {
    const oldHashes = this.messageHashes
    const { lastReadTimestamp = 0 } = this._storableState

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
  async _updatePeers () {
    const peers = await this._getPeers()
    runInAction(() => {
      this.peers = peers
    })
  }

  @action // Called while loading from local filesystem
  _onLoadProgress (...args) {
    const entry = this.parseMessage(args[2])
    this._loadBatch.push(entry)
    this.loadingHistory = true
  }

  @action // Called when done loading from local filesystem
  _onLoaded () {
    const messages = this._loadBatch.filter(e => e)
    this._loadBatch = []
    this._updateMessages(messages)
    this.loadingHistory = false
  }

  @action // Called while loading from IPFS (receiving new messages)
  _onReplicateProgress (...args) {
    const entry = this.parseMessage(args[2])
    this._replicationBatch.push(entry)
    this.loadingNewMessages = true
  }

  @action // Called when done loading from IPFS
  _onReplicated () {
    const messages = this._replicationBatch.filter(e => e)
    this._replicationBatch = []
    this._updateMessages(messages)
    this.loadingNewMessages = false
  }

  @action // Called when the user writes a message (text or file)
  _onWrite (...args) {
    this._updateMessages([this.parseMessage(args[2][0])])
    if (this._sendingMessageCounter > 0) this._sendingMessageCounter -= 1
  }

  @action
  _onError (err) {
    logger.error(this.channelName, err)
    this.loadingHistory = false
    this.loadingNewMessages = false
  }

  @action.bound
  _loadState () {
    try {
      Object.assign(this._storableState, this._getStoredStates()[this.name] || {})
    } catch (err) {}
  }

  // Public instance actions

  @action.bound
  markMessageAsRead (message) {
    message.unread = false

    // Check if we need to update the last read timestamp
    const { lastReadTimestamp } = this._storableState
    if (!lastReadTimestamp || message.Post.meta.ts > lastReadTimestamp) {
      this._storableState.lastReadTimestamp = message.Post.meta.ts
    }
  }

  @action.bound
  sendMessage (text) {
    this._sendingMessageCounter += 1

    // TODO: fix the compatibility issue here (exlcude incompatible browsers)
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
      this._sendQueue.push({ text, resolve, reject })
    })
  }

  @action.bound
  sendFiles (files) {
    const promises = []
    for (let i = 0; i < files.length; i++) {
      promises.push(
        // TODO: fix the compatibility issue here (exlcude incompatible browsers)
        // eslint-disable-next-line compat/compat
        new Promise((resolve, reject) => {
          runInAction(() => {
            this._sendingMessageCounter += 1
          })
          const f = files[i]
          const reader = new FileReader()
          reader.onload = event => {
            this._sendQueue.push({
              file: {
                filename: f.name,
                buffer: event.target.result,
                meta: { mimeType: f.type, size: f.size }
              },
              resolve,
              reject
            })
          }
          reader.readAsArrayBuffer(f)
        })
      )
    }

    // TODO: fix the compatibility issue here (exlcude incompatible browsers)
    // eslint-disable-next-line compat/compat
    return Promise.all(promises)
  }

  // Private instance methods

  _getPeers () {
    return this.network.ipfs.pubsub.peers(this.feed.address.toString())
  }

  _getStoredStates () {
    return JSON.parse(localStorage.getItem(this.storagekey)) || {}
  }

  _saveState () {
    try {
      const states = Object.assign(this._getStoredStates(), { [this.name]: this._storableState })
      localStorage.setItem(this.storagekey, JSON.stringify(states))
    } catch (err) {}
  }

  _processSendQueue () {
    if (this._sendQueue.length === 0 || this._sending) return

    this._sending = true

    const task = this._sendQueue.shift()

    let promise

    if (task.text) {
      promise = this.network.orbit.send(this.name, task.text)
    } else if (task.file) {
      promise = this.network.orbit.addFile(this.name, task.file)
    }

    if (promise && promise.then) {
      promise.then(task.resolve, task.reject).finally(() => {
        this._sending = false
      })
    } else this._sending = false
  }

  // Public instance methods
  leave () {
    this.network.leaveChannel(this.name)
  }

  parseMessage (entry) {
    try {
      return JSON.parse(entry.payload.value)
    } catch (err) {
      logger.warn(`Channel '${this.name}' failed to parse payload from message. Error:`, err)
    }
  }

  stop () {
    clearInterval(this.peerInterval)
    clearInterval(this.processSendQueueInterval)

    this.feed.events.removeListener('error', this._onError)
    this.feed.events.removeListener('load.progress', this._onLoadProgress)
    this.feed.events.removeListener('ready', this._onLoaded)
    this.feed.events.removeListener('replicate.progress', this._onReplicateProgress)
    this.feed.events.removeListener('replicated', this._onReplicated)
    this.feed.events.removeListener('write', this._onWrite)
  }
}
