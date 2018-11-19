'use strict'

import { action, computed, configure, observable, reaction } from 'mobx'

import { throttleEvent } from 'utils/throttle'

import Themes from 'themes'

configure({ enforceActions: 'observed' })
throttleEvent('resize', 'optimizedResize', window)

export default class UiStore {
  @observable.struct
  windowDimensions = {
    width: 0,
    height: 0
  }

  @observable
  _loading = []

  @observable
  title = 'Orbit'

  @observable
  isControlPanelOpen = false

  @observable
  _currentChannelName = null

  constructor (rootStore) {
    this.rootStore = rootStore
    this.settingsStore = this.rootStore.settingsStore

    window.addEventListener('optimizedResize', this.onWindowResize)

    this.windowDimensions = this.getWindowDimensions()

    reaction(
      () => this.title,
      title => {
        document.title = title
      }
    )
  }

  @computed
  get currentChannelName () {
    return this._currentChannelName
  }

  @computed
  get language () {
    return this.settingsStore.uiSettings.language
  }

  set language (val) {
    this.settingsStore.uiSettings.language = val
  }

  @computed
  get loading () {
    return this._loading.length > 0
  }

  @computed
  get theme () {
    return Themes[this.themeName]
  }

  @computed
  get themeName () {
    return this.settingsStore.uiSettings.themeName
  }

  set themeName (val) {
    this.settingsStore.uiSettings.themeName = val
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

  @action.bound
  onWindowResize (event) {
    this.windowDimensions = this.getWindowDimensions()
  }

  @action.bound
  startLoading (name) {
    if (this._loading.indexOf(name) !== -1) return
    this._loading.push(name)
  }

  @action.bound
  stopLoading (name) {
    const idx = this._loading.indexOf(name)
    this._loading.splice(idx, 1)
  }

  @action.bound
  setTitle (val) {
    this.title = val
  }

  @action.bound
  setCurrentChannelName (val) {
    this._currentChannelName = val
  }

  @action.bound
  openControlPanel () {
    this.isControlPanelOpen = true
  }

  @action.bound
  closeControlPanel () {
    this.isControlPanelOpen = false
  }

  @action.bound
  toggleControlPanel () {
    this.isControlPanelOpen = !this.isControlPanelOpen
  }

  getWindowDimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}
