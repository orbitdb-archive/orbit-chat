'use strict'

import { configure, action, observable } from 'mobx'

import throttleEvent from 'utils/throttleEvent'
import Logger from 'utils/logger'
import Themes from 'themes'

// Important! This import will inject i18n to the whole app
import i18n from 'config/i18n.config'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class UiStore {
  @observable.struct
  windowDimensions = {
    width: 0,
    height: 0
  }

  @observable
  theme = null

  constructor (rootStore) {
    this.rootStore = rootStore

    throttleEvent('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', this.onWindowResize)

    this.windowDimensions = this.getWindowDimensions()
    this.theme = Themes.Default
  }

  @action.bound
  onWindowResize (event) {
    this.windowDimensions = this.getWindowDimensions()
  }

  @action.bound
  setTheme (theme) {
    this.theme = theme
  }

  changeLanguage (lng) {
    i18n.changeLanguage(lng)
  }

  getWindowDimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}
