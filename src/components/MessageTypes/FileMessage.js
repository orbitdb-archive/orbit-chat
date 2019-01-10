'use strict'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup } from 'react-transition-group'

import FilePreview from '../FilePreview'

import { getHumanReadableSize, isAudio, isText, isImage, isVideo } from '../../utils/file-helpers'

import '../../styles/FileMessage.scss'

function FileMessage ({ t, animationProps, hash, meta, ...rest }) {
  const [showPreview, setShowPreview] = useState(false)

  const { name, size, mimeType } = meta

  async function handleNameClick () {
    if (!showPreview && (!isImage(name) && !isText(name) && !isAudio(name) && !isVideo(name))) {
      return
    }
    setShowPreview(!showPreview)
  }

  const ipfsLink =
    (window.gatewayAddress ? 'http://' + window.gatewayAddress : 'https://ipfs.io/ipfs/') + hash

  return (
    <div className="FileMessage">
      <div>
        <span className="name" onClick={handleNameClick}>
          {name}
        </span>
        <span className="size">{getHumanReadableSize(size)}</span>
        <a className="download" href={ipfsLink} target="_blank" rel="noopener noreferrer">
          {t('channel.file.open')}
        </a>
        <a className="download" href={ipfsLink} download={name}>
          {t('channel.file.download')}
        </a>
        <FilePreview
          t={t}
          animationProps={animationProps}
          hash={hash}
          name={name}
          mimeType={mimeType}
          show={showPreview}
          {...rest}
        />
      </div>
    </div>
  )
}

FileMessage.propTypes = {
  t: PropTypes.func.isRequired,
  animationProps: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    mimeType: PropTypes.string.isRequired
  }).isRequired
}

export default FileMessage
