'use strict'

import { action, computed, configure, keys, observable, reaction, values } from 'mobx'

import ChannelStore from './ChannelStore'
import IpfsStore from './IpfsStore'
import OrbitStore from './OrbitStore'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class NetworkStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.sessionStore = rootStore.sessionStore
    this.ipfsStore = new IpfsStore(this)
    this.orbitStore = new OrbitStore(this)

    this.onUsernameChanged = this.onUsernameChanged.bind(this)

    // React to ipfs changes
    reaction(() => this.ipfsStore.node, this.onIpfsChanged)

    // React to orbit changes
    reaction(() => this.orbitStore.node, this.onOrbitChanged)

    // React to user changes
    reaction(() => this.sessionStore.username, this.onUsernameChanged)
  }

  networkName = 'Orbit DEV Network'

  @observable
  channels = {}

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

  @computed
  get starting () {
    return this.ipfsStore.starting || this.orbitStore.starting
  }

  @computed
  get hasUnreadMessages () {
    return this.channelsAsArray.some(c => c.hasUnreadMessages)
  }

  get channelNames () {
    return keys(this.channels)
  }

  get channelsAsArray () {
    return values(this.channels)
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
    if (this.channelNames.indexOf(channelName) !== -1) return
    const channelSetup = Object.assign({}, this.orbit.channels[channelName], { network: this })
    this.channels[channelName] = new ChannelStore(channelSetup)
  }

  @action.bound
  onLeftChannel (channelName) {
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

    await this.orbitStore.stop()
    await this.ipfsStore.stop()
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
    return this.orbit.join(channelName)
  }

  leaveChannel (channelName) {
    if (!this.orbit || this.channelNames.indexOf(channelName) === -1) return
    return this.orbit.leave(channelName)
  }

  @action.bound
  removeChannel (channelName) {
    this.channels[channelName].stop()
    delete this.channels[channelName]
  }

  useJsIPFS () {
    return this.ipfsStore.useJsIPFS()
  }

  useGoIPFS () {
    return this.ipfsStore.useGoIPFS()
  }
}
