'use strict'

import { configure, action, observable } from 'mobx'

configure({ enforceActions: 'observed' })

export default class UiStore {
  @observable
  leftPanelOpen = false

  @observable
  rightPanelOpen = false

  @action.bound
  toggleLeftPanel () {
    this.leftPanelOpen = !this.leftPanelOpen
  }

  @action.bound
  toggleRightPanel () {
    this.rightPanelOpen = !this.rightPanelOpen
  }
}
