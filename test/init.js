require('@babel/register')()
require('babel-polyfill')
require('ignore-styles')

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const { window } = new JSDOM()
global.document = window.document
global.window = window

global.navigator = {
  userAgent: 'node.js'
}
