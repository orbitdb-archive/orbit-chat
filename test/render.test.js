'use strict'
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import { spy } from 'sinon'
import App from '../src/views/App'

describe('<App />', () => {
  it('should mount', () => {
    spy(App.prototype, 'componentDidMount')
    mount(<App />)
    expect(App.prototype.componentDidMount.calledOnce).to.equal(true)
  })
})
