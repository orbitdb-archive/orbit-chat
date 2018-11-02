'use strict'

import { configure, action, runInAction, computed } from 'mobx'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class ChannelHandler {
  constructor (networkStore, channelName) {
    this.networkStore = networkStore
    this.channelName = channelName
    this.feed = networkStore.channels[this.channelName].feed

    this.feed.events.once('ready', this.onReady.bind(this))
    this.feed.events.on('error', this.onError.bind(this))
    this.feed.events.on('replicated', this.onReplicated.bind(this))

    this.stop = this.stop.bind(this)
  }

  @computed
  get messages () {
    return this.networkStore.channels[this.channelName].messages
  }

  set messages (messages) {
    this.networkStore.channels[this.channelName].messages = messages
  }

  @action
  async onReady () {
    const messages = await this.networkStore.orbit.get(this.channelName, null, null, -1)
    runInAction(() => {
      this.messages = messages
    })
  }

  @action
  async onReplicated () {
    const messages = await this.networkStore.orbit.get(
      this.channelName,
      null,
      null,
      this.messages.length + 64
    )
    runInAction(() => {
      this.messages = messages
    })
  }

  onError (err) {
    logger.error(this.channelName, err)
  }

  stop () {
    this.feed.events.removeListener('ready', this.onReady)
    this.feed.events.removeListener('error', this.onError)
    this.feed.events.removeListener('replicated', this.onReplicated)
  }
}
