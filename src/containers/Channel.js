'use strict'

import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import Logger from '../utils/logger'

import RootStoreContext from '../context/RootStoreContext'

import ChannelControls from './ChannelControls'
import ChannelMessages from './ChannelMessages'

import '../styles/Channel.scss'

const logger = new Logger()

function Channel ({ channelName }) {
  const { networkStore } = useContext(RootStoreContext)
  const [channel, setChannel] = useState(null)
  const [shouldRedirectToIndex, setShouldRedirectToIndex] = useState(false)

  let mounted = true

  async function joinChannel () {
    try {
      await networkStore.joinChannel(channelName)
      if (mounted) setChannel(networkStore.channels[channelName])
    } catch (err) {
      logger.error(err)
      if (mounted) setShouldRedirectToIndex(true)
    }
  }

  useEffect(
    () => {
      joinChannel()
      return () => {
        mounted = false
      }
    },
    [channelName]
  )

  if (shouldRedirectToIndex) return <Redirect to="/" />

  if (!channel) return null

  return (
    <div className="Channel flipped">
      <ChannelMessages channel={channel} />
      <ChannelControls channel={channel} />
    </div>
  )
}

Channel.propTypes = {
  channelName: PropTypes.string.isRequired
}

export default Channel
