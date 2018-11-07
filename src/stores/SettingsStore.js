'use strict'

import { action, configure, observable, reaction, set, get } from 'mobx'

// Important! This import will inject i18n to the whole app
import i18n from 'config/i18n.config'

import Logger from 'utils/logger'

import defaulNetworkSettings from 'config/network.default.json'
import defaultUiSettings from 'config/ui.default.json'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class SettingsStore {
  constructor (rootStore) {
    this.rootStore = rootStore

    this.networkSettings = observable.object({})
    this.uiSettings = observable.object({})

    this.saveNetworkSettings = this.saveNetworkSettings.bind(this)
    this.saveUiSettings = this.saveUiSettings.bind(this)
    this.updateLanguage = this.updateLanguage.bind(this)

    // Reload settings when user changes
    reaction(() => this.rootStore.sessionStore.username, this.load)

    // Need to react to language changes
    // since we need to call 'i18n.changeLanguage'
    reaction(() => get(this.uiSettings, 'language'), this.updateLanguage)

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
    set(this.networkSettings, settings)
    this.saveNetworkSettings()
  }

  @action.bound
  updateUiSettings (settings) {
    set(this.uiSettings, settings)
    this.saveUiSettings()
  }

  @action.bound
  load () {
    let networkSettings = {}
    let uiSettings = {}

    try {
      const { networkKey, uiKey } = this.settingsKeys
      networkSettings = JSON.parse(localStorage.getItem(networkKey)) || {}
      uiSettings = JSON.parse(localStorage.getItem(uiKey)) || {}
    } catch (e) {}

    set(this.networkSettings, Object.assign({}, defaulNetworkSettings, networkSettings))
    set(this.uiSettings, Object.assign({}, defaultUiSettings, uiSettings))
  }

  saveNetworkSettings () {
    try {
      const { networkKey } = this.settingsKeys
      localStorage.setItem(networkKey, JSON.stringify(this.networkSettings))
    } catch (e) {}
  }

  saveUiSettings () {
    try {
      const { uiKey } = this.settingsKeys
      localStorage.setItem(uiKey, JSON.stringify(this.uiSettings))
    } catch (e) {}
  }

  updateLanguage (lng) {
    i18n.changeLanguage(lng)
  }
}
