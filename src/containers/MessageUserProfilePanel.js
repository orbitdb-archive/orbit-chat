'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import Countries from '../config/countries.json'

import RootStoreContext from '../context/RootStoreContext'

import BackgroundAnimation from '../components/BackgroundAnimation'

import '../styles/MessageUserProfilePanel.scss'
import earthImg from '../images/earth.png'

function MessageUserProfilePanel ({ t }, { uiStore }) {
  const { userProfilePanelPosition, userProfilePanelUser, windowDimensions } = uiStore

  const isOpen = userProfilePanelPosition && userProfilePanelUser
  if (!isOpen) return null

  const user = userProfilePanelUser

  const country = Countries[user.location]
  const location = country ? country + ', Earth' : 'Earth'

  const { x: left, y: top } = userProfilePanelPosition
  const translateHorizontal = left > windowDimensions.width / 2 ? '-100%' : '0'
  const translateVertical = top > windowDimensions.height / 2 ? '-100%' : '0'
  const style = { left, top, transform: `translate(${translateHorizontal}, ${translateVertical})` }

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
      <div className="name">{user.name}</div>
      <div className="country">{location}</div>
      <dl className="profileDataContainer">
        <dt>{t('userProfile.identityProvider')}:</dt>
        <dd>{user.identityProvider.provider}</dd>
        <dt>{t('userProfile.signingKey')}:</dt>
        <dd>{user.signKey}</dd>
      </dl>
    </div>
  )
}

MessageUserProfilePanel.contextType = RootStoreContext

MessageUserProfilePanel.propTypes = {
  t: PropTypes.func.isRequired
}

export default withNamespaces()(observer(MessageUserProfilePanel))
