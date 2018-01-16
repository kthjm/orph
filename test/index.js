import Orph from '../src'
import assert from 'power-assert'
import sinon from 'sinon'
import React, { Component } from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

it(`throw in attach(react.setState: false | !function)`, () => {
  const orph = new Orph()
  const invalidSetStates = ['str', 10, true, undefined, null, {}, []]
  invalidSetStates.forEach(invalidSetState =>
    assert.throws(
      () => orph.attach({ setState: invalidSetState }),
      /orph.attach must be passed react/
    )
  )
})

it('orph.order(undefined)', () => {
  const orph = new Orph()
  const listeners = orph.order()
  assert.deepEqual(listeners, {})
})

it(`orph.list()`, () => {
  const orph = new Orph()

  orph.register(
    {
      FOO: () => {},
      BAR: () => {},
      BAA: () => {}
    },
    {
      prefix: 'PREFIX:',
      use: {
        state: true,
        dispatch: true
      }
    }
  )

  assert.deepEqual(orph.list(), {
    'PREFIX:FOO': ['state', 'dispatch'],
    'PREFIX:BAR': ['state', 'dispatch'],
    'PREFIX:BAA': ['state', 'dispatch']
  })
})

it(`state() => render() => state()`, () => {
  const prevState = { foo: true, bar: 100 }
  const nextState = { foo: 'foo', bar: false }

  const NAME = 'LISTENER'
  const orph = new Orph(prevState)

  orph.register(
    {
      [NAME]: ({ resolve }, { state, render }) => {
        assert.equal(state('foo'), prevState.foo)
        assert.equal(state('bar'), prevState.bar)

        // react.state is changed
        render(nextState, () => {
          assert.notEqual(state('foo'), prevState.foo)
          assert.notEqual(state('bar'), prevState.bar)
          assert.equal(state('foo'), nextState.foo)
          assert.equal(state('bar'), nextState.bar)
          resolve()
        })
      }
    },
    {
      use: { state: true, render: true }
    }
  )

  class JustStub extends Component {
    constructor(props) {
      super(props)
      orph.attach(this)
    }
    render() {
      return <div />
    }
  }

  Enzyme.mount(<JustStub />)
  return new Promise(resolve => orph.dispatch(NAME, { resolve }))
})

it(`notEqual(prevState,state) in componentDidUpdate`, async () => {
  // whether strict or not depend state.object change or not
  const NAME = 'LISTENER'
  const orph = new Orph({
    foo: { key: true },
    bar: { key: 'value' }
  })

  // render { foo } as same value, same structure, but different object.
  orph.register(
    {
      [NAME]: (e, { render }) => render({ foo: { key: true } })
    },
    {
      use: { render: true }
    }
  )

  class TestDidUpdate extends Component {
    constructor(props) {
      super(props)
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
})

it(`detach`, async () => {
  const NAME = 'LISTENER'
  const orph = new Orph()

  orph.register(
    {
      [NAME]: (e, { props, state, update, render, dispatch }) => {
        assert.equal(props, undefined)
        assert.equal(state, undefined)
        assert.equal(update, undefined)
        assert.equal(render, undefined)
        assert.equal(dispatch, undefined)
      }
    },
    {
      use: {
        props: true,
        state: true,
        update: true,
        render: true,
        dispatch: true
      }
    }
  )

  class JustStub extends Component {
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
  orph.detach()
  await orph.dispatch(NAME)
  return
})

it(`simulate("click")`, () => {
  const orph = new Orph()
  const NAME = 'LISTENER'

  orph.register(
    {
      [NAME]: ({ resolve }, { update, render }) => {
        const { componentDidUpdate } = DivOnClick.prototype
        assert.ok(componentDidUpdate.notCalled)

        update(() => assert.ok(componentDidUpdate.calledOnce))

        setTimeout(
          () =>
            render({}, () => {
              assert.ok(componentDidUpdate.calledTwice)
              resolve()
            }),
          300
        )
      }
    },
    {
      use: {
        update: true,
        render: true
      }
    }
  )

  const { LISTENER } = orph.order([NAME])

  class DivOnClick extends Component {
    constructor(props) {
      super(props)
      orph.attach(this)
    }

    render() {
      return <div id="div" onClick={LISTENER} />
    }

    componentDidUpdate() {
      // inspect times this method called.
    }
  }

  sinon.spy(DivOnClick.prototype, 'componentDidUpdate')

  return new Promise(resolve =>
    Enzyme.mount(<DivOnClick />)
      .find(`#div`)
      .simulate(`click`, { resolve })
  )
})

it(`render(updater)`, () => {
  const firstState = { invert: true }
  const orph = new Orph(firstState)
  const NAME = 'LISTENER'

  orph.register(
    {
      [NAME]: ({ resolve }, { render, state }) =>
        render(
          (prevState, props) => ({ invert: !prevState.invert }),
          () => {
            assert.equal(state('invert'), !firstState.invert)
            resolve()
          }
        )
    },
    {
      use: { render: true, state: true }
    }
  )

  class SetStateUpdater extends Component {
    constructor(props) {
      super(props)
      orph.attach(this)
    }
    render() {
      return <div />
    }
  }

  Enzyme.mount(<SetStateUpdater />)
  return new Promise(resolve => orph.dispatch(NAME, { resolve }))
})

it(`props/state(name, false)`, () => {
  const firstProps = { obj: { key: 'value' } }
  const firstState = { arr: [{ key: 'value' }] }
  const orph = new Orph(firstState)
  const NAME = 'LISTENER'

  orph.register(
    {
      [NAME]: ({ resolve }, { props, state, update }) => {
        // rewrite props
        const propsObj = props('obj')
        propsObj.key = 'nextvalue'

        // rewrite state
        const stateArr = state('arr')
        stateArr[0].key = 'nextvalue'
        stateArr.push({ key: 'nextvalue' })

        update(() => {
          // inspect they are not rewrited
          assert.notEqual(props('obj'), propsObj)
          assert.deepEqual(props('obj'), firstProps.obj)

          assert.notEqual(state('arr'), stateArr)
          assert.deepEqual(state('arr'), firstState.arr)

          resolve()
        })
      }
    },
    {
      use: {
        props: true,
        state: true,
        update: true
      }
    }
  )

  class Stateful extends Component {
    constructor(props) {
      super(props)
      orph.attach(this)
    }
    render() {
      return <div />
    }
  }

  Enzyme.mount(<Stateful {...firstProps} />)
  return new Promise(resolve => orph.dispatch(NAME, { resolve }))
})

it('props/state(name, true)', () => {
  const initialProps = { obj: { key: 'value' } }
  const initialState = { arr: [] }
  const store = new Orph(initialState)

  store.register(
    {
      LISTENER: ({ resolve }, { props, state, update }) => {
        const obj = props('obj', true)
        assert.equal(obj.key, 'value')

        const arr = state('arr', true)
        assert.equal(arr.length, 0)

        // rewrite
        obj.key = 'valueRewrited'
        arr.push(0)

        update(() => {
          // inspect they are rewrited
          assert.equal(props('obj').key, 'valueRewrited')
          assert.equal(state('arr').length, 1)
          resolve()
        })
      }
    },
    {
      use: { state: true, props: true, update: true }
    }
  )

  class StateRewrited extends Component {
    constructor(props) {
      super(props)
      store.attach(this)
    }
    render() {
      return <div />
    }
  }

  Enzyme.mount(<StateRewrited {...initialProps} />)
  return new Promise(resolve => store.dispatch('LISTENER', { resolve }))
})

it('_escapeState', async () => {
  const initialState = { count: 0 }
  const store = new Orph(initialState)
  store.register(
    {
      CHANGE_STATE: (n, { render }) => render({ count: 100 }),
      CONFIRM_STATE: (n, { state }) => assert.equal(state('count'), 100)
    },
    {
      use: { render: true, state: true }
    }
  )

  class WillUnmount extends Component {
    constructor(props) {
      super(props)
      store.attach(this)
    }
    render() {
      return <div />
    }
    componentWillUnmount() {
      // save this.state as store's state
      store.detach(true)
    }
  }

  const wrapper1 = Enzyme.mount(<WillUnmount />)
  await store.dispatch('CHANGE_STATE')
  wrapper1.unmount()

  Enzyme.mount(<WillUnmount />)
  await store.dispatch('CONFIRM_STATE')
  return
})
