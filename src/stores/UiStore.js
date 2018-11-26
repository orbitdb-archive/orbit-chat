'use strict'

import { action, computed, configure, observable, reaction } from 'mobx'

import Themes from '../themes'

configure({ enforceActions: 'observed' })

/**
 * UiStore acts as an interface between SettingsStore and the user.
 * It is also reponsible for tracking different UI related variables.
 */
export default class UiStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.settingsStore = this.rootStore.settingsStore

    reaction(
      () => this._title,
      title => {
        document.title = title
      }
    )
  }

  // Private instance variables

  @observable
  _currentChannelName = null

  @observable
  _isControlPanelOpen = false

  @observable
  _title = 'Orbit'

  // Public instance variable getters

  @computed
  get currentChannelName () {
    return this._currentChannelName
  }

  @computed
  get isControlPanelOpen () {
    return this._isControlPanelOpen
  }

  @computed
  get title () {
    return this._title
  }

  // Public instance variable setters

  @action.bound
  setCurrentChannelName (val) {
    this._currentChannelName = val
  }

  @action.bound
  openControlPanel () {
    this._isControlPanelOpen = true
  }

  @action.bound
  closeControlPanel () {
    this._isControlPanelOpen = false
  }

  @action.bound
  toggleControlPanel () {
    this._isControlPanelOpen = !this._isControlPanelOpen
  }

  @action.bound
  setTitle (val) {
    this._title = val
  }

  // SettingsStore interface

  @computed
  get themeName () {
    return this.settingsStore.uiSettings.themeName
  }

  set themeName (val) {
    this.settingsStore.uiSettings.themeName = val
  }

  @computed
  get theme () {
    return Themes[this.themeName]
  }

  @computed
  get language () {
    return this.settingsStore.uiSettings.language
  }

  set language (val) {
    this.settingsStore.uiSettings.language = val
  }

  @computed
  get colorifyUsernames () {
    return this.settingsStore.uiSettings.colorifyUsernames
  }

  set colorifyUsernames (val) {
    this.settingsStore.uiSettings.colorifyUsernames = val
  }

  @computed
  get useEmojis () {
    return this.settingsStore.uiSettings.useEmojis
  }

  set useEmojis (val) {
    this.settingsStore.uiSettings.useEmojis = val
  }

  @computed
  get emojiSet () {
    return this.settingsStore.uiSettings.emojiSet
  }

  set emojiSet (val) {
    this.settingsStore.uiSettings.emojiSet = val
  }

  @computed
  get useLargeMessage () {
    return this.settingsStore.uiSettings.useLargeMessage
  }

  set useLargeMessage (val) {
    this.settingsStore.uiSettings.useLargeMessage = val
  }

  @computed
  get useMonospaceFont () {
    return this.settingsStore.uiSettings.useMonospaceFont
  }

  set useMonospaceFont (val) {
    this.settingsStore.uiSettings.useMonospaceFont = val
  }

  @computed
  get sidePanelPosition () {
    return this.settingsStore.uiSettings.sidePanelPosition
  }

  set sidePanelPosition (val) {
    this.settingsStore.uiSettings.sidePanelPosition = val
  }
}
