'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function PreviewVideoFile ({ stream, filename, ...rest }) {
  return null
}

PreviewVideoFile.propTypes = {
  stream: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired
}

export default PreviewVideoFile
