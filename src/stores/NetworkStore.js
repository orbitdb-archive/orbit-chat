'use strict'

import { action, computed, configure, keys, observable, reaction, values } from 'mobx'

import ChannelStore from './ChannelStore'
import IpfsStore from './IpfsStore'
import OrbitStore from './OrbitStore'

import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class NetworkStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.session = rootStore.sessionStore
    this.settings = rootStore.settingsStore
    this.ipfsStore = new IpfsStore(this)
    this.orbitStore = new OrbitStore(this)

    this.joinChannel = this.joinChannel.bind(this)

    // Stop if user logs out
    reaction(
      () => this.session.username,
      username => {
        if (!username) this.stop()
      }
    )

    // React to ipfs changes
    reaction(() => this.ipfsStore.node, this._onIpfsChanged)

    // React to orbit changes
    reaction(() => this.orbitStore.node, this._onOrbitChanged)
  }

  // Private instance variables

  @observable
  _ipfs = null

  @observable
  _orbit = null

  // Public instance variables

  networkName = 'Orbit DEV Network'

  @observable
  channels = {}

  @observable
  swarmPeers = []

  // Public instance getters

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

  // Private instance actions

  @action.bound
  _onIpfsChanged (newIpfs) {
    this._ipfs = newIpfs
  }

  @action.bound
  _onOrbitChanged (newOrbit) {
    this._stopOrbit()

    this._orbit = newOrbit

    if (this.orbit) this._onOrbitStarted(this.orbit)
  }

  @action.bound
  _onJoinedChannel (channelName) {
    if (this.channelNames.indexOf(channelName) !== -1) return
    const channelSetup = Object.assign({}, this.orbit.channels[channelName], { network: this })
    this.channels[channelName] = new ChannelStore(channelSetup)

    // Save the channel to localstorage
    // so user will connect to it automatically next time
    this.settings.networkSettings.channels = [
      ...this.settings.networkSettings.channels.filter(c => c !== channelName),
      channelName
    ]
  }

  @action.bound
  _onLeftChannel (channelName) {
    this.removeChannel(channelName)

    // Remove the channel from localstorage
    this.settings.networkSettings.channels = this.settings.networkSettings.channels.filter(
      c => c !== channelName
    )
  }

  @action.bound
  _onSwarmPeerUpdate (peers) {
    this.swarmPeers = peers
  }

  @action.bound
  _stopOrbit () {
    this.channelNames.map(this.removeChannel)
    this.swarmPeers = []
    if (this.orbit) this._onOrbitStopped(this.orbit)
  }

  @action.bound
  removeChannel (channelName) {
    this.channels[channelName].stop()
    delete this.channels[channelName]
  }

  // Private instance methods

  _onOrbitStarted (orbit) {
    orbit.events.on('joined', this._onJoinedChannel)
    orbit.events.on('left', this._onLeftChannel)
    orbit.events.on('peers', this._onSwarmPeerUpdate)

    // Join all channnels that are saved in localstorage for current user
    this.settings.networkSettings.channels.map(this.joinChannel)
  }

  _onOrbitStopped (orbit) {
    orbit.events.removeListener('joined', this._onJoinedChannel)
    orbit.events.removeListener('left', this._onLeftChannel)
    orbit.events.removeListener('peers', this._onSwarmPeerUpdate)
  }

  // Public instance methods

  async stop () {
    if (!this.isOnline) return
    logger.info('Stopping network')

    this._stopOrbit()

    await this.orbitStore.stop()
    await this.ipfsStore.stop()
  }

  async joinChannel (channelName) {
    if (!this.isOnline) throw new Error('Network is offline')

    if (this.channelNames.indexOf(channelName) !== -1) return

    await this.orbit.join(channelName)
  }

  leaveChannel (channelName) {
    if (!this.orbit || this.channelNames.indexOf(channelName) === -1) return
    return this.orbit.leave(channelName)
  }

  useJsIPFS () {
    return this.ipfsStore.useJsIPFS()
  }

  useGoIPFS () {
    return this.ipfsStore.useGoIPFS()
  }
}
