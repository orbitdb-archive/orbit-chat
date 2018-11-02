'use strict'

import { configure, action, observable, reaction, computed } from 'mobx'

import ChannelHandler from './ChannelHandler'

import IpfsStore from './IpfsStore'
import OrbitStore from './OrbitStore'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class NetworkStore {
  constructor ({ userStore }) {
    this.ipfsStore = new IpfsStore({ userStore })
    this.orbitStore = new OrbitStore({ userStore, ipfsStore: this.ipfsStore })

    this.onUsernameChanged = this.onUsernameChanged.bind(this)

    // React to ipfs changes
    reaction(() => this.ipfsStore.node, this.onIpfsChanged)

    // React to orbit changes
    reaction(() => this.orbitStore.node, this.onOrbitChanged)

    // React to user changes
    reaction(() => userStore.username, this.onUsernameChanged)
  }

  @observable
  _ipfs = null

  @observable
  _orbit = null

  @observable
  channels = {}

  @observable
  swarmPeers = []

  _username = null

  @computed
  get orbit () {
    return this._orbit
  }

  @computed
  get running () {
    return this._ipfs && this._orbit
  }

  @computed
  get channelNames () {
    return Object.keys(this.channels)
  }

  @computed
  get feeds () {
    return Object.values(this.channels).map(c => c.feed)
  }

  @computed
  get channelHandlers () {
    return Object.values(this.channels).map(c => c.handler)
  }

  @action.bound
  onIpfsChanged (newIpfs) {
    this._ipfs = newIpfs
  }

  @action.bound
  onOrbitChanged (newOrbit) {
    this.stopOrbit()

    this._orbit = newOrbit

    if (this._orbit) {
      this._orbit.events.on('joined', this.onJoinedChannel)
      this._orbit.events.on('left', this.onLeftChannel)
      this._orbit.events.on('peers', this.onSwarmPeerUpdate)
    }
  }

  @action.bound
  onJoinedChannel (channelName) {
    if (this.channelNames.indexOf(channelName) !== -1) return
    this.channels[channelName] = this._orbit.channels[channelName]
    this.channels[channelName].handler = new ChannelHandler(this, channelName)
  }

  @action.bound
  onLeftChannel (channelName) {
    this.channels[channelName].handler.stop()
    delete this.channels[channelName]
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
    if (!this.running) return
    logger.info('Stopping network')

    this.stopOrbit()

    await this.orbitStore.stop()
    await this.ipfsStore.stop()
  }

  @action.bound
  stopOrbit () {
    this.channelHandlers.map(s => s.stop())

    this.channels = {}
    this.swarmPeers = []

    if (this._orbit) {
      this._orbit.events.removeListener('joined', this.onJoinedChannel)
      this._orbit.events.removeListener('left', this.onLeftChannel)
      this._orbit.events.removeListener('peers', this.onSwarmPeerUpdate)
    }
  }

  joinChannel (channelName) {
    if (!this._orbit || this.channelNames.indexOf(channelName) !== -1) return
    this._orbit.join(channelName)
  }

  leaveChannel (channelName) {
    if (!this._orbit || this.channelNames.indexOf(channelName) === -1) return
    this._orbit.leave(channelName)
  }
}
