'use strict'

import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import LoadAsync from '../components/Loadable'

import Logger from '../utils/logger'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/Channel.scss'

const ChannelControls = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelControls" */ './ChannelControls')
})
const ChannelMessages = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelMessages" */ './ChannelMessages')
})

const logger = new Logger()

function Channel ({ channelName }) {
  const [channel, setChannel] = useState(null)
  const { networkStore, uiStore } = useContext(RootStoreContext)

  let mounted = true

  useEffect(handleChannelNameChange, [channelName])

  function handleChannelNameChange () {
    uiStore.setTitle(`#${channelName} | Orbit`)
    uiStore.setCurrentChannelName(channelName)

    networkStore.joinChannel(channelName).then(channel => {
      if (mounted) setChannel(channel)
    })

    return () => {
      mounted = false
      uiStore.setCurrentChannelName(null)
      uiStore.closeUserProfilePanel()
    }
  }

  return channel ? (
    <div className="Channel flipped">
      <ChannelMessages channel={channel} />
      <ChannelControls channel={channel} />
    </div>
  ) : null
}

Channel.propTypes = {
  channelName: PropTypes.string.isRequired
}

export default Channel
