'use strict'

import { action, computed, configure, observable, reaction } from 'mobx'

import throttleEvent from 'utils/throttleEvent'

import Themes from 'themes'

configure({ enforceActions: 'observed' })

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

  constructor (rootStore) {
    this.rootStore = rootStore
    this.settingsStore = this.rootStore.settingsStore
    this.updateUiSettings = this.settingsStore.updateUiSettings

    throttleEvent('resize', 'optimizedResize')
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
  get useLargeMessage () {
    return this.settingsStore.uiSettings.useLargeMessage
  }

  set useLargeMessage (val) {
    this.settingsStore.uiSettings.useLargeMessage = val
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
  setTitle (title) {
    this.title = title
  }

  getWindowDimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}
