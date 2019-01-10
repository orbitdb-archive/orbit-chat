'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'

import RootStoreContext from '../context/RootStoreContext'

import BackgroundAnimation from '../components/BackgroundAnimation'

import '../styles/LoadingView.scss'

class LoadingView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { uiStore } = this.context
    uiStore.setTitle('Loading | Orbit')
  }

  render () {
    const { uiStore } = this.context
    const { t } = this.props

    const transitionProps = {
      appear: true,
      timeout: { appear: 5000, enter: 5000, exit: 5000 }
    }

    return (
      <div className="LoadingView">
        <CSSTransition
          className="header"
          component="div"
          classNames="loadingHeaderAnimation"
          {...transitionProps}
        >
          <h1>{t('loading')}</h1>
        </CSSTransition>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} />
      </div>
    )
  }
}

export default withNamespaces()(observer(LoadingView))
