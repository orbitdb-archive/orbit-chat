'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import MoonLoader from './MoonLoader'

function Spinner ({ className, theme, ...rest }) {
  return (
    <div className={className} style={theme}>
      <MoonLoader className="spinnerIcon" {...rest} />
    </div>
  )
}

Spinner.defaultProps = {
  className: 'spinner'
}

Spinner.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string
}

export default Spinner
