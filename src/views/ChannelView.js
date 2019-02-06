'use strict'

import React, { useEffect, useState, useContext } from 'react'
import { hot } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import LoadAsync from '../components/Loadable'

import Logger from '../utils/logger'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/ChannelView.scss'

const Channel = LoadAsync({
  loader: () => import(/* webpackChunkName: "Channel" */ '../containers/Channel')
})
const MessageUserProfilePanel = LoadAsync({
  loader: () =>
    import(/* webpackChunkName: "MessageUserProfilePanel" */ '../containers/MessageUserProfilePanel')
})

const logger = new Logger()

function ChannelView (props) {
  const [shouldRedirectToIndex, setShouldRedirectToIndex] = useState(false)
  const { networkStore, uiStore } = useContext(RootStoreContext)

  const {
    match: {
      params: { channel: channelName }
    }
  } = props

  useEffect(() => {
    checkNetwork()
    handleChannelName()

    return () => {
      uiStore.setCurrentChannelName(null)
      uiStore.closeUserProfilePanel()
    }
  })

  function checkNetwork () {
    if (!networkStore.isOnline) {
      logger.warn(`Network is offline`)
      setShouldRedirectToIndex(true)
    }
  }

  function handleChannelName () {
    uiStore.setTitle(`#${channelName} | Orbit`)
    uiStore.setCurrentChannelName(channelName)
  }

  if (shouldRedirectToIndex) return <Redirect to="/" />

  return (
    <div className="ChannelView">
      {/* Render the profile panel of a user */}
      {/* This is the panel that is shown when a username is clicked in chat  */}
      <MessageUserProfilePanel />

      {/* Render the channel */}
      <Channel channelName={channelName} />
    </div>
  )
}

ChannelView.propTypes = {
  match: PropTypes.object.isRequired
}

export default hot(module)(ChannelView)
