'use strict'

import { configure, action, observable } from 'mobx'

import throttleEvent from 'utils/throttleEvent'
import Logger from 'utils/logger'

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

    throttleEvent('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', this.onWindowResize)

    this.windowDimensions = this.getWindowDimensions()
  }

  @action.bound
  onWindowResize (event) {
    this.windowDimensions = this.getWindowDimensions()
  }

  getWindowDimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}
