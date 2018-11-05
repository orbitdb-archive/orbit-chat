'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import 'styles/BackgroundAnimation.scss'

const defaultDelay = 0.2

function BackgroundAnimation ({
  circleSize,
  size,
  startX,
  startY,
  delay = defaultDelay,
  theme,
  style
}) {
  const maxSize = (size || window.innerWidth) / 2
  const minSize = 32 * (size / 256)
  const amount = 7
  const opacity = 1
  const colors = [
    'rgba(50, 32, 56, ' + opacity + ')',
    'rgba(62, 32, 76, ' + opacity + ')',
    'rgba(87, 32, 110, ' + opacity + ')',
    'rgba(118, 32, 154, ' + opacity + ')',
    'rgba(156, 56, 203, ' + opacity + ')',
    'rgba(188, 84, 238, ' + opacity + ')',
    'rgba(225, 170, 253, ' + opacity + ')'
  ].reverse()

  const inc = (maxSize - minSize) / (amount - 1)
  const rings = [0, 1, 2, 3, 4, 5, 6]

  const circles = rings.reverse().map(i => {
    const radius = minSize + i * inc
    const color = colors[i]
    return (
      <circle
        cx={startX || size / 2}
        cy={startY || size / 2}
        r={radius}
        fill={color}
        key={'circle' + i}
        style={{ animationDelay: delay + 0.1 * i + 's' }}
      />
    )
  })

  const dots = rings.map(i => {
    const speed = 0.5
    const velocity = ((i + 1) * 9.80665) / speed
    const c = Math.max(212 - i * 16, 0)
    const color = `rgba(${c}, ${c}, ${c}, ${0.5 - (i + 1) * 0.01})` // 0.025
    const mul = Math.random() < 0.5 ? -1 : 1 // randomize between negative and positive pos
    const pos = (minSize + i * inc) * mul // starting position for the dot
    const dotSize = (circleSize || 1) * (Math.random() * 2) + 1
    const startRadians = Math.floor(Math.random() * 360)
    const keyframes = `@keyframes rot${i} {
        0%   { transform: rotate(${startRadians}deg) translate(${pos}px) rotate(-${startRadians}deg) }
        100% { transform: rotate(${startRadians +
          360}deg) translate(${pos}px) rotate(-${startRadians + 360}deg) }
      }`

    const styleSheet = document.styleSheets[0]
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length)

    return (
      <circle
        cx={startX || size / 2}
        cy={startY || size / 2}
        r={dotSize}
        fill={color}
        style={{
          animation: `rot${i} linear`,
          animationDuration: `${velocity}s`,
          animationIterationCount: 'infinite'
        }}
        key={'dot' + i}
      />
    )
  })

  return (
    <div className="BackgroundAnimation" style={style}>
      <svg className="Rings" width={size} height={size} key="circles" style={theme}>
        <g className="transparent">{circles}</g>
      </svg>
      <svg className="Planets opaque" width={size} height={size} key="dots" style={theme}>
        {dots}
      </svg>
    </div>
  )
}

BackgroundAnimation.propTypes = {
  circleSize: PropTypes.number,
  size: PropTypes.number,
  startX: PropTypes.number,
  startY: PropTypes.number,
  delay: PropTypes.number,
  theme: PropTypes.object,
  style: PropTypes.object
}

export default observer(BackgroundAnimation)
