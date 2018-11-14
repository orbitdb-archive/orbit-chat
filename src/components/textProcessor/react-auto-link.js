'use strict'
// https://github.com/moudy/react-autolinker/blob/master/src/index.js

// MIT License

// Copyright (c) 2017 Moudy Elkammash

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React from 'react'
import Autolinker from 'autolinker'

// Returns an array of React elements
function reactAutoLink (input, options, wordIndex) {
  const tags = []

  Autolinker.link(input, {
    replaceFn: match => {
      const tag = match.buildTag()
      tags.push(tag)
      return tag
    }
  })

  let _text = input
  const elements = []
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    const splitText = _text.includes(tag.attrs.href) ? tag.attrs.href : tag.innerHtml
    const parts = _text.split(splitText)
    const props = Object.assign(tag.attrs, { key: `${tag.attrs.href}-${wordIndex}-${i}` }, options)
    elements.push(parts.shift())
    elements.push(React.createElement(tag.tagName, props, tag.innerHtml))
    _text = parts.join(tag.attrs.href)
  }

  elements.push(_text)

  return elements
}

export default reactAutoLink
