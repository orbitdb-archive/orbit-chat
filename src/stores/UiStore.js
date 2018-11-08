'use strict'

import { computed, configure, action, observable, get, reaction } from 'mobx'

import throttleEvent from 'utils/throttleEvent'
import Logger from 'utils/logger'
import Themes from 'themes'

configure({ enforceActions: 'observed' })

const logger = new Logger()

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
  get loading () {
    return this._loading.length > 0
  }

  @computed
  get themeName () {
    return get(this.settingsStore.uiSettings, 'themeName')
  }

  @computed
  get theme () {
    return Themes[this.themeName]
  }

  @computed
  get language () {
    return get(this.settingsStore.uiSettings, 'language')
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

  setTheme (themeName) {
    this.updateUiSettings({ themeName })
  }

  setLanguage (language) {
    this.updateUiSettings({ language })
  }

  getWindowDimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}
