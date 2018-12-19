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

class MoonLoader extends React.Component {
  static displayName = 'MoonLoader'

  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string
  }

  static defaultProps = {
    color: '#ffffff',
    size: '60px'
  }

  getBallStyle (size) {
    return {
      width: size,
      height: size,
      borderRadius: '100%'
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

    switch (i) {
      case 1:
        return appendVendorPrefix(
          Object.assign(this.getBallStyle(moonSize), this.getAnimationStyle(), {
            backgroundColor: this.props.color,
            opacity: '0.8',
            position: 'absolute',
            top: size / 2 - moonSize / 2
          })
        )
      case 2:
        return appendVendorPrefix(
          Object.assign(this.getBallStyle(size), {
            border: moonSize + 'px solid ' + this.props.color,
            opacity: 0.1
          })
        )
      default:
        return appendVendorPrefix(
          Object.assign(this.getAnimationStyle(), {
            position: 'relative'
          })
        )
    }
  }

  render () {
    const styles = [this.getStyle(0), this.getStyle(1), this.getStyle(2)]

    return (
      <div className={this.props.className}>
        <div style={styles[0]}>
          <div style={styles[1]} />
          <div style={styles[2]} />
        </div>
      </div>
    )
  }
}

export default MoonLoader
