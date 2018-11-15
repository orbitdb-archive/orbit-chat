'use strict'

import { action, configure, observable, reaction, values } from 'mobx'

import defaulNetworkSettings from 'config/network.default.json'
import defaultUiSettings from 'config/ui.default.json'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()
export default class SettingsStore {
  @observable
  networkSettings = {}

  @observable
  uiSettings = {}

  constructor (rootStore) {
    this.rootStore = rootStore

    this.saveNetworkSettings = this.saveNetworkSettings.bind(this)
    this.saveUiSettings = this.saveUiSettings.bind(this)
    this.updateLanguage = this.updateLanguage.bind(this)

    // Reload settings when user changes
    reaction(() => this.rootStore.sessionStore.username, this.load)

    // Need to react to language changes
    // since we need to call 'i18n.changeLanguage'
    reaction(() => this.uiSettings.language, this.updateLanguage)

    // Save network settings when they change
    reaction(
      () => values(this.networkSettings),
      () => {
        this.saveNetworkSettings()
      }
    )

    // Save ui settings when they change
    reaction(
      () => values(this.uiSettings),
      () => {
        this.saveUiSettings()
      }
    )

    this.load()
  }

  get settingsKeys () {
    if (!this.rootStore.sessionStore.username) throw new Error('No logged in user')
    return {
      networkKey: `orbit-chat.${this.rootStore.sessionStore.username}.network-settings`,
      uiKey: `orbit-chat.${this.rootStore.sessionStore.username}.ui-settings`
    }
  }

  @action.bound
  updateNetworkSettings (settings) {
    Object.assign(this.networkSettings, settings)
  }

  @action.bound
  updateUiSettings (settings) {
    Object.assign(this.uiSettings, settings)
  }

  @action.bound
  load () {
    let networkSettings = {}
    let uiSettings = {}

    try {
      const { networkKey, uiKey } = this.settingsKeys
      networkSettings = JSON.parse(localStorage.getItem(networkKey)) || {}
      uiSettings = JSON.parse(localStorage.getItem(uiKey)) || {}
    } catch (err) {}

    logger.debug('Loading network settings')
    Object.assign(this.networkSettings, defaulNetworkSettings, networkSettings)

    logger.debug('Loading ui settings')
    Object.assign(this.uiSettings, defaultUiSettings, uiSettings)
  }

  saveNetworkSettings () {
    try {
      const { networkKey } = this.settingsKeys
      logger.debug('Saving network settings')
      localStorage.setItem(networkKey, JSON.stringify(this.networkSettings))
    } catch (err) {}
  }

  saveUiSettings () {
    try {
      const { uiKey } = this.settingsKeys
      logger.debug('Saving ui settings')
      localStorage.setItem(uiKey, JSON.stringify(this.uiSettings))
    } catch (err) {}
  }

  updateLanguage (lng) {
    this.rootStore.i18n.changeLanguage(lng)
  }
}
