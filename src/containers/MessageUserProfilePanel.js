'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import Countries from '../config/countries.json'

import RootStoreContext from '../context/RootStoreContext'

import BackgroundAnimation from '../components/BackgroundAnimation'

import '../styles/MessageUserProfilePanel.scss'
import earthImg from '../images/earth.png'

setConfig({
  pureSFC: true,
  pureRender: true
})

class MessageUserProfilePanel extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render () {
    const { t } = this.props
    const { uiStore } = this.context

    const { userProfilePanelPosition, userProfilePanelUser, windowDimensions } = uiStore

    const isOpen = userProfilePanelPosition && userProfilePanelUser
    if (!isOpen) return null

    const user = userProfilePanelUser

    const country = Countries[user.profile.location]

    const { x: left, y: top } = userProfilePanelPosition
    const translateHorizontal = left > windowDimensions.width / 2 ? '-100%' : '0'
    const translateVertical = top > windowDimensions.height / 2 ? '-100%' : '0'
    const style = {
      left,
      top,
      transform: `translate(${translateHorizontal}, ${translateVertical})`
    }

    return (
      <div className="MessageUserProfilePanel" style={style}>
        <BackgroundAnimation
          style={{ top: '-30px', left: '-70px', zIndex: '-1', display: 'block' }}
          size={256}
          theme={{ ...uiStore.theme }}
        />
        <span className="close" onClick={uiStore.closeUserProfilePanel}>
          X
        </span>
        <CSSTransitionGroup
          transitionName="profilePictureAnimation"
          transitionAppear={true}
          component="div"
          transitionAppearTimeout={1500}
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}>
          <img className="picture" src={earthImg} />
        </CSSTransitionGroup>
        <div className="name">{user.profile.name}</div>
        <div className="country">{country ? country + ', Earth' : 'Earth'}</div>
        <dl className="profileDataContainer">
          <dt>{t('userProfile.identityType')}:</dt>
          <dd>{user.identity.type}</dd>
          <dt>{t('userProfile.identityId')}:</dt>
          <dd className="code">{user.identity.id}</dd>
          <dt>{t('userProfile.identityPublicKey')}:</dt>
          <dd className="code">{user.identity.publicKey}</dd>
        </dl>
      </div>
    )
  }
}

export default hot(module)(withNamespaces()(observer(MessageUserProfilePanel)))
