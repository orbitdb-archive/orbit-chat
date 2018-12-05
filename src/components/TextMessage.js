'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import textProcessor from './textProcessor'

import '../styles/TextMessage.scss'

function TextMessage ({ text, highlightWords, useEmojis, emojiSet, animationProps }) {
  let content = text.startsWith('/me ') ? text.substring(4, text.length) : text

  content = textProcessor.ipfsfy(content, { useAutolink: true })
  content = textProcessor.autolink(content)
  content = textProcessor.highlight(content, { className: 'highlight', highlightWords })
  content = useEmojis ? textProcessor.emojify(content, { set: emojiSet }) : content

  content = textProcessor.render(content)

  return (
    <div className="TextMessage">
      <CSSTransitionGroup {...animationProps}>{content}</CSSTransitionGroup>
    </div>
  )
}

TextMessage.propTypes = {
  text: PropTypes.string.isRequired,
  highlightWords: PropTypes.array,
  useEmojis: PropTypes.bool.isRequired,
  emojiSet: PropTypes.string.isRequired,
  animationProps: PropTypes.object.isRequired
}

TextMessage.defaultProps = {
  highlightWords: []
}

export default TextMessage
