'use strict'

import {
  action,
  computed,
  configure,
  get,
  keys,
  observable,
  reaction,
  remove,
  runInAction,
  set,
  values
} from 'mobx'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class NetworkStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.startLoading = this.rootStore.uiStore.startLoading
    this.stopLoading = this.rootStore.uiStore.stopLoading

    this.channels = observable.object({})

    this.onUsernameChanged = this.onUsernameChanged.bind(this)

    // React to ipfs changes
    reaction(() => this.rootStore.ipfsStore.node, this.onIpfsChanged)

    // React to orbit changes
    reaction(() => this.rootStore.orbitStore.node, this.onOrbitChanged)

    // React to user changes
    reaction(() => this.rootStore.sessionStore.username, this.onUsernameChanged)
  }

  @observable
  _ipfs = null

  @observable
  _orbit = null

  @observable
  swarmPeers = []

  _username = null

  @computed
  get ipfs () {
    return this._ipfs
  }

  @computed
  get orbit () {
    return this._orbit
  }

  @computed
  get isOnline () {
    return this._ipfs && this._orbit
  }

  get channelNames () {
    return keys(this.channels)
  }

  get channelsAsArray () {
    return values(this.channels)
  }

  getChannel (channelName) {
    return get(this.channels, channelName)
  }

  @action.bound
  onIpfsChanged (newIpfs) {
    this._ipfs = newIpfs
  }

  @action.bound
  onOrbitChanged (newOrbit) {
    this.stopOrbit()

    this._orbit = newOrbit

    if (this.orbit) {
      this.orbit.events.on('joined', this.onJoinedChannel)
      this.orbit.events.on('left', this.onLeftChannel)
      this.orbit.events.on('peers', this.onSwarmPeerUpdate)
    }
  }

  @action.bound
  onJoinedChannel (channelName) {
    this.stopLoading('channel:join')
    if (this.channelNames.indexOf(channelName) !== -1) return
    const channelSetup = Object.assign({}, this.orbit.channels[channelName], { store: this })
    set(this.channels, channelName, new Channel(channelSetup))
  }

  @action.bound
  onLeftChannel (channelName) {
    this.stopLoading('channel:leave')
    this.removeChannel(channelName)
  }

  @action.bound
  onSwarmPeerUpdate (peers) {
    this.swarmPeers = peers
  }

  onUsernameChanged (newUsername) {
    if (newUsername !== this._username) this.stop()
    this._username = newUsername
  }

  async stop () {
    if (!this.isOnline) return
    logger.info('Stopping network')

    this.stopOrbit()

    await this.rootStore.orbitStore.stop()
    await this.rootStore.ipfsStore.stop()
  }

  @action.bound
  stopOrbit () {
    this.channelNames.map(this.removeChannel)

    this.swarmPeers = []

    if (this.orbit) {
      this.orbit.events.removeListener('joined', this.onJoinedChannel)
      this.orbit.events.removeListener('left', this.onLeftChannel)
      this.orbit.events.removeListener('peers', this.onSwarmPeerUpdate)
    }
  }

  joinChannel (channelName) {
    if (!this.orbit || this.channelNames.indexOf(channelName) !== -1) return
    this.startLoading('channel:join')
    this.orbit.join(channelName)
  }

  leaveChannel (channelName) {
    if (!this.orbit || this.channelNames.indexOf(channelName) === -1) return
    this.startLoading('channel:leave')
    this.orbit.leave(channelName)
  }

  @action.bound
  removeChannel (channelName) {
    const channel = get(this.channels, channelName)
    channel.stop()
    remove(this.channels, channelName)
  }
}

class Channel {
  @observable
  messages = []

  @observable
  peers = []

  constructor ({ store, feed, name }) {
    this.store = store
    this.feed = feed
    this.name = name

    this.peerInterval = setInterval(this.updatePeers, 1000)

    this.feed.events.once('ready', this.onReady.bind(this))
    this.feed.events.on('error', this.onError.bind(this))
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

  onReady () {
    this.updateMessages(-1)
  }

  onReplicated () {
    this.updateMessages(this.messages.length + 64)
  }

  @action
  onWrite (channel, logHash, message) {
    this.messages.push(this.parseMessage(message[0]))
  }

  onError (err) {
    logger.error(this.channelName, err)
  }

  stop () {
    clearInterval(this.peerInterval)

    this.feed.events.removeListener('ready', this.onReady)
    this.feed.events.removeListener('error', this.onError)
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
    return this.store.ipfs.pubsub.peers(this.feed.address.toString())
  }

  async sendMessage (text) {
    await this.store.orbit.send(this.name, text)
  }
}
