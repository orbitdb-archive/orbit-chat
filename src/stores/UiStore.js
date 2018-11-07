'use strict'

import { computed, configure, action, observable, get } from 'mobx'

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

  constructor (rootStore) {
    this.rootStore = rootStore
    this.settingsStore = this.rootStore.settingsStore
    this.updateUiSettings = this.settingsStore.updateUiSettings

    throttleEvent('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', this.onWindowResize)

    this.windowDimensions = this.getWindowDimensions()
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
