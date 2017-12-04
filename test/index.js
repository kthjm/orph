import assert from 'power-assert'
import sinon from 'sinon'
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

import Orph from '../src'

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

  Enzyme.mount(<JustStub />)
  await orph.dispatch(NAME)
  return

  async function listener(e, utils) {
    assert.notEqual(utils.state(), prevState)
    assert.deepEqual(utils.state(), prevState)

    // react.state is changed
    utils.render(nextState, () => {
      const nowState = utils.state()
      assert.notDeepEqual(nowState, prevState)
      assert.deepEqual(nowState, nextState)
    })
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

  Enzyme.mount(<TestDidUpdate />)
  await orph.dispatch(NAME)
  return

  function listener(e, utils) {
    const prevState = utils.state()

    // "bar" is left as.
    utils.render({ foo: { key: true } }, () => {
      const nowState = utils.state()

      assert.ok(prevState.foo !== nowState.foo)
      assert.ok(prevState.bar === nowState.bar)
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

  Enzyme.mount(<JustStub />)

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
      setTimeout(async () => {
        assert.deepStrictEqual(utils.props, undefined)
        assert.deepStrictEqual(utils.state, undefined)
        assert.deepStrictEqual(utils.update, undefined)
        assert.deepStrictEqual(utils.render(), null)

        try {
          await utils.dispatch()
        } catch (e) {
          assert.equal(e.message, `not active but _exec()`)
          resolve()
        }
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
    componentDidUpdate() {}
  }

  sinon.spy(DivOnClick.prototype, 'componentDidUpdate')

  return new Promise(resolve =>
    Enzyme.mount(<DivOnClick />)
      .find(`#div`)
      .simulate(`click`, { resolve })
  )

  function listener({ resolve }, utils) {
    const { componentDidUpdate } = DivOnClick.prototype
    assert.ok(componentDidUpdate.notCalled)
    utils.update(() => assert.ok(componentDidUpdate.calledOnce))
    setTimeout(
      () =>
        utils.render({}, () => {
          assert.ok(componentDidUpdate.calledTwice)
          resolve()
        }),
      300
    )
  }
})

it(`render(updater)`, async () => {
  const NAME = 'LISTENER'
  const orph = new Orph([[NAME, listener]])

  const firstProps = {}
  const firstState = { invert: true }

  class SetStateUpdater extends React.Component {
    constructor(props) {
      super(props)
      this.state = firstState
      orph.attach(this)
    }
    render() {
      return <div />
    }
  }

  Enzyme.mount(<SetStateUpdater {...firstProps} />)
  await orph.dispatch(NAME)
  return

  function listener(e, utils) {
    utils.render(updater, callback)

    function updater(prevState, props) {
      assert.deepStrictEqual(props, firstProps)
      return { invert: !prevState.invert }
    }

    function callback() {
      assert.deepEqual(utils.state(), { invert: false })
    }
  }
})
