'use strict'

import { action, configure, observable, computed, runInAction } from 'mobx'

import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class SessionStore {
  constructor (rootStore) {
    this.rootStore = rootStore

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  @observable.struct
  _user = null

  _prevUser = null

  @computed
  get username () {
    if (!this._user || !this._user.username) return null
    return this._user.username
  }

  @computed
  get isAuthenticated () {
    return !!(this._user && this._user.username)
  }

  get prevUsername () {
    if (!this._prevUser || !this._prevUser.username) return null
    return this._prevUser.username || null
  }

  // Async so the API is consistend if async is needed in the future
  @action.bound
  async setUser (user) {
    if (user && !user.username) throw new Error('"user.username" is not defined')
    runInAction(() => {
      this._prevUser = this._user
      this._user = user
    })
  }

  login (user) {
    logger.info('User login')
    return this.setUser(user)
  }

  logout () {
    logger.info('User logout')
    return this.setUser(null)
  }
}
