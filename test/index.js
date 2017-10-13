import assert from 'power-assert'
import Orph from '../src'
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

it(`state() => render() => state()`, async () => {
  const NAME = 'LISTENER'
  const orph = new Orph([[NAME, listener]])

  const prevState = { foo: true, bar: 100 }
  const nextState = { foo: 'foo', bar: false }
  class JustStub extends React.Component {
    constructor(props) {
      super(props)
      this.state = prevState
      orph.attach(this)
    }
    render() {
      return <div />
    }
  }
  const wrapper = Enzyme.mount(<JustStub />)
  await orph.dispatch(NAME)
  return

  async function listener(e, utils) {
    assert.notEqual(utils.state(), prevState)
    assert.deepEqual(utils.state(), prevState)

    utils.render(nextState) // react.state is changed

    assert.notDeepEqual(utils.state(), prevState)
    assert.deepEqual(utils.state(), nextState)
  }
})

it(`componentDidUpdate notEqual(prestate,state)`, async () => {
  // whether strict or not depend state.object change or not
  const NAME = 'LISTENER'
  const orph = new Orph([[NAME, listener]])
  class TestDidUpdate extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        foo: { key: true },
        bar: { key: 'value' }
      }
      orph.attach(this)
    }
    render() {
      return <div />
    }
    componentDidUpdate(prevProps, prevState) {
      assert.ok(prevState.foo !== this.state.foo)
      assert.ok(prevState.bar === this.state.bar)
    }
  }

  const wrapper = Enzyme.mount(<TestDidUpdate />)
  await orph.dispatch(NAME)
  return

  function listener(e, utils) {
    utils.render({
      foo: { key: true }
      // bar is left as.
    })
  }
})

it(`detach in progress of listener`, () => {
  const NAME = 'LISTENER'
  const orph = new Orph([[NAME, listener]])

  class JustStub extends React.Component {
    constructor(props) {
      super(props)
      orph.attach(this)
    }
    render() {
      return <div />
    }
    componentDidUpdate(prevProps, prevState) {
      throw new Error(`componentDidUpdate must not run`)
    }
  }

  const wrapper = Enzyme.mount(<JustStub />)

  return new Promise(resolve => {
    orph.dispatch(NAME).then(resolve)

    Promise.resolve().then(() => orph.detach())

    /**
        * dispatch() => detach() => resolve
        *
        * when orph.dispatch(NAME), orph.active is true, so listener is run.
        * and the listener return promise that resolved after 300ms.
        * because run between 300ms, orph.detach() is promisified.
        * still orph.active is false when utils.render()
        * so componentDidUpdate is not run.
        * This supposed using orph at child stateful component.
        */
  })

  function listener(e, utils) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        utils.render() // must return false because orph.detach()
        resolve()
      }, 300)
    })
  }
})

it(`simulate("click")`, () => {
  const NAME = 'LISTENER'
  const orph = new Orph([[NAME, listener]])

  class DivOnClick extends React.Component {
    constructor(props) {
      super(props)
      orph.attach(this)
      this.divOnClick = orph.create(NAME)
    }
    render() {
      return <div id="div" onClick={this.divOnClick} />
    }
    componentDidUpdate() {
      assert.ok(true)
    }
  }

  return new Promise(resolve =>
    Enzyme.mount(<DivOnClick />)
      .find(`#div`)
      .simulate(`click`, { resolve })
  )

  async function listener(e, utils) {
    utils.render()
    e.resolve()
  }
})
