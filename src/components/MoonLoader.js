'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import insertKeyframesRule from 'domkit/insertKeyframesRule'
import appendVendorPrefix from 'domkit/appendVendorPrefix'

const keyframes = {
  '100%': {
    transform: 'rotate(360deg)'
  }
}

const animationName = insertKeyframesRule(keyframes)

class Loader extends React.Component {
  static displayName = 'Loader'

  static propTypes = {
    loading: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string,
    margin: PropTypes.string,
    verticalAlign: PropTypes.string,
    ballSize: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string
  }

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '60px'
  }

  getBallStyle (size) {
    return {
      width: size,
      height: size,
      borderRadius: '100%',
      verticalAlign: this.props.verticalAlign
    }
  }

  getAnimationStyle () {
    const animation = [animationName, '0.8s', '0s', 'infinite', 'linear'].join(' ')
    const animationFillMode = 'forwards'

    return { animation, animationFillMode }
  }

  getStyle (i) {
    const size = parseInt(this.props.size)
    const moonSize = size / 7

    let style

    switch (i) {
      case 1:
        style = Object.assign(this.getBallStyle(moonSize), this.getAnimationStyle(), {
          backgroundColor: this.props.color,
          opacity: '0.8',
          position: 'absolute',
          top: size / 2 - moonSize / 2
        })
        break
      case 2:
        style = Object.assign(this.getBallStyle(size), {
          border: moonSize + 'px solid ' + this.props.color,
          opacity: 0.1
        })
        break
      default:
        style = Object.assign(this.getAnimationStyle(), {
          position: 'relative'
        })
        break
    }

    return appendVendorPrefix(style)
  }

  render () {
    if (!this.props.loading) return null

    return React.createElement(
      'div',
      { id: this.props.id, className: this.props.className },
      React.createElement(
        'div',
        { style: this.getStyle(0) },
        React.createElement('div', { style: this.getStyle(1) }),
        React.createElement('div', { style: this.getStyle(2) })
      )
    )
  }
}

export default Loader
