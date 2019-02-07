'use strict'

import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import RootStoreContext from '../context/RootStoreContext'

import ChannelControls from './ChannelControls'
import ChannelMessages from './ChannelMessages'

import '../styles/Channel.scss'

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
