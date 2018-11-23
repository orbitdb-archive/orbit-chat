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
    this.session = rootStore.sessionStore
    this.settings = rootStore.settingsStore
    this.ipfsStore = new IpfsStore(this)
    this.orbitStore = new OrbitStore(this)

    this.onUsernameChanged = this.onUsernameChanged.bind(this)
    this.joinChannel = this.joinChannel.bind(this)

    // React to ipfs changes
    reaction(() => this.ipfsStore.node, this.onIpfsChanged)

    // React to orbit changes
    reaction(() => this.orbitStore.node, this.onOrbitChanged)

    // React to user changes
    reaction(() => this.session.username, this.onUsernameChanged)
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

    if (this.orbit) this.onOrbitStarted(this.orbit)
  }

  @action.bound
  onJoinedChannel (channelName) {
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
  onLeftChannel (channelName) {
    this.removeChannel(channelName)

    // Remove the channel from localstorage
    this.settings.networkSettings.channels = this.settings.networkSettings.channels.filter(
      c => c !== channelName
    )
  }

  @action.bound
  onSwarmPeerUpdate (peers) {
    this.swarmPeers = peers
  }

  onOrbitStarted (orbit) {
    orbit.events.on('joined', this.onJoinedChannel)
    orbit.events.on('left', this.onLeftChannel)
    orbit.events.on('peers', this.onSwarmPeerUpdate)

    // Join all channnels that are saved in localstorage for current user
    this.settings.networkSettings.channels.map(this.joinChannel)
  }

  onOrbitStopped (orbit) {
    orbit.events.removeListener('joined', this.onJoinedChannel)
    orbit.events.removeListener('left', this.onLeftChannel)
    orbit.events.removeListener('peers', this.onSwarmPeerUpdate)
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
    if (this.orbit) this.onOrbitStopped(this.orbit)
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
