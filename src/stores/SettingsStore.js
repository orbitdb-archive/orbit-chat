'use strict'

import { action, configure, observable, reaction, values, computed } from 'mobx'

import defaulNetworkSettings from 'config/network.default.json'
import defaultUiSettings from 'config/ui.default.json'

configure({ enforceActions: 'observed' })

export default class SettingsStore {
  @observable
  networkSettings = {}

  @observable
  uiSettings = {}

  constructor (rootStore) {
    this.rootStore = rootStore
    this.sessionStore = rootStore.sessionStore

    this.saveNetworkSettings = this.saveNetworkSettings.bind(this)
    this.saveUiSettings = this.saveUiSettings.bind(this)
    this.updateLanguage = this.updateLanguage.bind(this)

    // Reload settings when user changes
    reaction(() => this.sessionStore.username, this.load)

    // Need to react to language changes
    // since we need to call 'i18n.changeLanguage'
    reaction(() => this.uiSettings.language, this.updateLanguage)

    // Save network settings when they change
    reaction(() => values(this.networkSettings), this.saveNetworkSettings)

    // Save ui settings when they change
    reaction(() => values(this.uiSettings), this.saveUiSettings)

    this.load()
  }

  @computed
  get settingsKeys () {
    const username = this.sessionStore.username
    if (!username) throw new Error('No logged in user')
    return {
      networkKey: `orbit-chat.${username}.network-settings`,
      uiKey: `orbit-chat.${username}.ui-settings`
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
  load (username) {
    let networkSettings = {}
    let uiSettings = {}

    // Create a copy so we can alter the values without affecting the original
    const defaulNetworkSettingsCopy = JSON.parse(JSON.stringify(defaulNetworkSettings))
    const defaultUiSettingsCopy = JSON.parse(JSON.stringify(defaultUiSettings))

    // Get user defined settings from local storage
    try {
      const { networkKey, uiKey } = this.settingsKeys
      networkSettings = JSON.parse(localStorage.getItem(networkKey)) || {}
      uiSettings = JSON.parse(localStorage.getItem(uiKey)) || {}
    } catch (err) {}

    // Set default orbit dataDir
    if (username && !networkSettings.orbit) {
      defaulNetworkSettingsCopy.orbit.dataDir += `/${username}`
    }

    // Set default ipfs repo
    if (!networkSettings.ipfs) {
      const { orbit } = defaulNetworkSettingsCopy
      defaulNetworkSettingsCopy.ipfs.repo = `${orbit.dataDir}/ipfs`
    }

    // Merge default settings with user defined settings
    Object.assign(this.networkSettings, defaulNetworkSettingsCopy, networkSettings)
    Object.assign(this.uiSettings, defaultUiSettingsCopy, uiSettings)
  }

  saveNetworkSettings () {
    try {
      const { networkKey } = this.settingsKeys
      localStorage.setItem(networkKey, JSON.stringify(this.networkSettings))
    } catch (err) {}
  }

  saveUiSettings () {
    try {
      const { uiKey } = this.settingsKeys
      localStorage.setItem(uiKey, JSON.stringify(this.uiSettings))
    } catch (err) {}
  }

  updateLanguage (lng) {
    this.rootStore.i18n.changeLanguage(lng)
  }
}
