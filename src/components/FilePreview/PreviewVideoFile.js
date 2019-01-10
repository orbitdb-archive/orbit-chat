'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { toArrayBuffer } from '../../utils/file-helpers'

function PreviewVideoFile ({ stream, filename, ...rest }) {
  const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
  const source = new MediaSource()
  const url = window.URL.createObjectURL(source)

  source.addEventListener('sourceopen', e => {
    const sourceBuffer = source.addSourceBuffer(mimeCodec)
    const buf = []

    sourceBuffer.addEventListener('updateend', () => {
      if (buf.length > 0) sourceBuffer.appendBuffer(buf.shift())
    })

    stream.on('data', data => {
      if (!sourceBuffer.updating) sourceBuffer.appendBuffer(toArrayBuffer(data))
      else buf.push(toArrayBuffer(data))
    })
    stream.on('end', () => {
      setTimeout(() => {
        if (source.readyState === 'open') source.endOfStream()
      }, 100)
    })
    stream.on('error', e => console.error(e))
  })
  return (
    <div>
      <video src={url} controls autoPlay={true} />
    </div>
  )
}

PreviewVideoFile.propTypes = {
  stream: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired
}

export default PreviewVideoFile
