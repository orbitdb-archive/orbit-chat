'use strict'

import { configure, action, observable, computed } from 'mobx'

import Logger from 'utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class UserStore {
  constructor () {
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  @observable
  _user = null

  _prevUser = null

  @computed
  get username () {
    if (!this._user || !this._user.username) return null
    return this._user.username
  }

  get prevUsername () {
    if (!this._prevUser || !this._prevUser.username) return null
    return this._prevUser.username || null
  }

  @action.bound
  setUser (user) {
    this._prevUser = this._user
    this._user = user
  }

  login (user) {
    logger.info('User login')
    this.setUser(user)
  }

  logout () {
    logger.info('User logout')
    this.setUser(null)
  }
}
