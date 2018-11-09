'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import { CSSTransitionGroup } from 'react-transition-group'

import RootStoreContext from 'context/RootStoreContext'

import BackgroundAnimation from 'components/BackgroundAnimation'

import 'styles/LoadingView.scss'

class LoadingView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render () {
    const { uiStore } = this.context
    const { t } = this.props

    const transitionProps = {
      transitionAppear: true,
      transitionAppearTimeout: 5000,
      transitionEnterTimeout: 5000,
      transitionLeaveTimeout: 5000
    }

    uiStore.setTitle('Loading | Orbit')

    return (
      <div className="LoadingView">
        <CSSTransitionGroup
          className="header"
          component="div"
          transitionName="loadingHeaderAnimation"
          {...transitionProps}>
          <h1>{t('loading')}</h1>
        </CSSTransitionGroup>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} />
      </div>
    )
  }
}

export default withNamespaces()(observer(LoadingView))
