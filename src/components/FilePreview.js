'use strict'

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import TextFile from './TextFile'

import Logger from '../utils/logger'
import { isAudio, isImage, isVideo, toArrayBuffer } from '../utils/file-helpers'

const logger = new Logger()

async function loadPreviewContent (loadFunc, hash, meta, name) {
  // TODO: Handle electron

  try {
    const { buffer, url, stream } = await loadFunc(hash)

    let blob = new Blob([])

    if (buffer instanceof Blob) {
      blob = buffer
    } else if (buffer && meta.mimeType) {
      blob = new Blob([toArrayBuffer(buffer)], { type: meta.mimeType })
    }

    const srcUrl = buffer ? window.URL.createObjectURL(blob) : url

    const todoErrorMsg = 'Only audio and image files are supported'

    if (buffer || url || stream) {
      if (isAudio(name)) {
        // Audio
        return <audio src={srcUrl} controls autoPlay={true} />
      } else if (isImage(name)) {
        // Image
        return <img src={srcUrl} />
      } else if (isVideo(name)) {
        // Video
      } else {
        // Text
        return <TextFile blob={blob} filename={name} />
      }
    }

    throw new Error(todoErrorMsg)
  } catch (e) {
    throw e
  }
}

function FilePreview ({ t, animationProps, hash, loadFile, meta, name, show }) {
  const [previewContent, setPreviewContent] = useState(t('channel.file.previewLoading'))

  let isMounted // track whether component is mounted

  useEffect(
    () => {
      isMounted = true

      if (!show) {
        setPreviewContent(t('channel.file.previewLoading'))
      } else {
        loadPreviewContent(loadFile, hash, meta, name)
          .then(html => {
            if (isMounted) setPreviewContent(html)
          })
          .catch(e => {
            logger.error(e)
            if (isMounted) setPreviewContent(t('channel.file.unableToDisplay'))
          })
      }

      return () => {
        // clean up, called when react dismounts this component
        isMounted = false
      }
    },
    [hash, show] // Only run effect if 'hash' or 'show' change
  )

  if (!show) return null

  return (
    <div className="FilePreview">
      <CSSTransitionGroup {...animationProps}>
        <span className="preview smallText">{previewContent}</span>
      </CSSTransitionGroup>
    </div>
  )
}

FilePreview.propTypes = {
  t: PropTypes.func.isRequired,
  animationProps: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  loadFile: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
}

export default FilePreview
