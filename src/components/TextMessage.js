'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import textProcessor from 'components/textProcessor'

function TextMessage ({ text, highlightWords, useEmojis, emojiSet }) {
  let content = text.startsWith('/me ') ? text.substring(4, text.length) : text

  content = textProcessor.ipfsfy(content, { useAutolink: true })
  content = textProcessor.autolink(content)
  content = textProcessor.highlight(content, { className: 'highlight', highlightWords })
  content = useEmojis ? textProcessor.emojify(content, { set: emojiSet }) : content

  content = textProcessor.render(content)

  return (
    <div className="TextMessage">
      <CSSTransitionGroup
        transitionName="textAnimation"
        transitionAppear={true}
        transitionEnter={false}
        transitionLeave={false}
        transitionAppearTimeout={200}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}>
        {content}
      </CSSTransitionGroup>
    </div>
  )
}

TextMessage.propTypes = {
  text: PropTypes.string.isRequired,
  highlightWords: PropTypes.array,
  useEmojis: PropTypes.bool.isRequired,
  emojiSet: PropTypes.string.isRequired
}

TextMessage.defaultProps = {
  highlightWords: []
}

export default TextMessage
