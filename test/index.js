import Orph from '../src'
import assert from 'power-assert'
import sinon from 'sinon'
import React, { Component } from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

describe('Orph.prototype.attach', () => {
  it(`throw because attach(react.setState: false | !function)`, () => {
    const orph = new Orph({})
    const invalidSetStates = ['str', 10, true, undefined, null, {}, []]
    invalidSetStates.forEach(invalidSetState =>
      assert.throws(
        () => orph.attach({ setState: invalidSetState }),
        /orph.attach must be passed react/
      )
    )
  })
})

describe('Orph.prototype.register', () => {
  const orph = new Orph({})
  const object = {}
  const excepts = [
    '',
    'string',
    0,
    1,
    true,
    false,
    undefined,
    null,
    [],
    () => {}
  ]

  it('!isObj(actions) => throws', () =>
    excepts.forEach(actions =>
      assert.throws(
        () => orph.register(actions),
        /Orph.prototype.register requires first argument as "object" not others/
      )
    ))
  it('!isObj(options) => throws', () =>
    excepts.forEach(options =>
      assert.throws(
        () => orph.register(object, options),
        /Orph.prototype.register requires second argument as "object" not others/
      )
    ))
  it('!isObj(options.use) => throws', () =>
    excepts.forEach(use =>
      assert.throws(
        () => orph.register(object, { use }),
        /Orph.prototype.register second argument requires "use" property as "object" not others/
      )
    ))

  it('orph.register({},{ use: {} })', () => {
    orph.register({}, { use: {} })
    assert.deepEqual(orph.list(), {})
  })
})

describe('Orph.prototype.order', () => {
  const orph = new Orph({})
  orph.register(
    {
      FOO: () => {},
      BAR: () => {},
      BAA: () => {}
    },
    {
      use: {}
    }
  )

  it('orph.order(!isArr) => throw', () =>
    [true, 'string', 1, {}, () => {}].forEach(names =>
      assert.throws(
        () => orph.order(names),
        /Orph.prototype.order requires argument as "array"/
      )
    ))

  it('orph.order([NAME])', () => {
    const names = ['FOO', 'BAR']
    const listeners = orph.order(names)
    assert.deepEqual(Object.keys(listeners), names)
  })

  it('orph.order(/*empty*/)', () =>
    [undefined, false, null, 0].forEach(names => {
      const listeners = orph.order(names)
      assert.deepEqual(Object.keys(listeners), ['FOO', 'BAR', 'BAA'])
    }))
})

describe(`Orph.prototype.list`, () => {
  it('orph.prototype.list', () => {
    const orph = new Orph({})

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
})

describe('e2e', () => {
  it(`state() => render() => state()`, () => {
    const prevState = { foo: true, bar: 100 }
    const nextState = { foo: 'foo', bar: false }

    const NAME = 'LISTENER'
    const orph = new Orph(prevState)

    orph.register(
      {
        [NAME]: async ({ resolve }, { state, render }) => {
          assert.equal(await state('foo'), prevState.foo)
          assert.equal(await state('bar'), prevState.bar)

          // react.state is changed
          render(nextState, async () => {
            assert.notEqual(await state('foo'), prevState.foo)
            assert.notEqual(await state('bar'), prevState.bar)
            assert.equal(await state('foo'), nextState.foo)
            assert.equal(await state('bar'), nextState.bar)
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

  it(`simulate("click")`, () => {
    const orph = new Orph({})
    const NAME = 'LISTENER'

    orph.register(
      {
        [NAME]: async ({ resolve }, { update, render }) => {
          const { componentDidUpdate } = DivOnClick.prototype
          assert.ok(componentDidUpdate.notCalled)

          await update(() => assert.ok(componentDidUpdate.calledOnce))

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
            async () => {
              assert.equal(await state('invert'), !firstState.invert)
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
        [NAME]: async ({ resolve }, { props, state, update }) => {
          // rewrite props
          const propsObj = await props('obj')
          propsObj.key = 'nextvalue'

          // rewrite state
          const stateArr = await state('arr')
          stateArr[0].key = 'nextvalue'
          stateArr.push({ key: 'nextvalue' })

          update(async () => {
            // inspect they are not rewrited
            assert.notEqual(await props('obj'), propsObj)
            assert.deepEqual(await props('obj'), firstProps.obj)

            assert.notEqual(await state('arr'), stateArr)
            assert.deepEqual(await state('arr'), firstState.arr)

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
        LISTENER: async (n, { props, state, update }) => {
          const obj = await props('obj', true)
          assert.equal(obj.key, 'value')

          const arr = await state('arr', true)
          assert.equal(arr.length, 0)

          // rewrite
          obj.key = 'valueRewrited'
          arr.push(0)

          // inspect they are rewrited
          return update(() =>
            Promise.resolve()
              .then(() => props('obj'))
              .then(obj => assert.equal(obj.key, 'valueRewrited'))
              .then(() => state('arr'))
              .then(arr => assert.equal(arr.length, 1))
          )
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
    return Promise.resolve(store.dispatch('LISTENER'))
  })

  it('_escapeState', async () => {
    const initialState = { count: 0 }
    const store = new Orph(initialState)
    store.register(
      {
        CHANGE_STATE: (n, { render }) => render({ count: 100 }),

        CONFIRM_STATE: (n, { state }) =>
          state('count').then(count => assert.equal(count, 100))
      },
      {
        use: { render: true, state: true }
      }
    )

    class WillUnmount extends Component {
      constructor(props) {
        super(props)
        store.attach(this, { inherit: true })
      }
      render() {
        return <div />
      }
      componentWillUnmount() {
        store.detach()
      }
    }

    const wrapper = Enzyme.mount(<WillUnmount />)
    await store.dispatch('CHANGE_STATE')
    wrapper.unmount()
    Enzyme.mount(<WillUnmount />)
    await store.dispatch('CONFIRM_STATE')
    return
  })

  it('!isAttached()', () => {
    class Hoge extends Component {
      constructor(props) {
        super(props)
        this.props.store.attach(this)
      }
      componentWillUnmount() {
        this.props.store.detach()
      }
      render() {
        return false
      }
    }

    const store = new Orph({})
    const NAME = 'NAME'

    store.register(
      {
        [NAME]: ({ unmount }, { props, state, render, update }) =>
          Promise.resolve()
            .then(() =>
              Promise.all(
                [props(), state(), render(), update()].map(promise => {
                  assert.deepStrictEqual(promise.constructor, Promise)
                  assert.deepStrictEqual(promise.then, Promise.prototype.then)
                  assert.deepStrictEqual(promise.catch, Promise.prototype.catch)
                  return promise.then(() => 'ok').catch(err => {
                    throw new Error('')
                  })
                })
              )
            )
            .then(results =>
              assert.deepEqual(results, ['ok', 'ok', 'ok', 'ok'])
            )
            .then(() => unmount())
            .then(() =>
              Promise.all(
                [props(), state(), render(), update()].map(promise => {
                  assert.deepStrictEqual(promise.constructor, Promise)
                  assert.deepStrictEqual(promise.then, Promise.prototype.then)
                  assert.deepStrictEqual(promise.catch, Promise.prototype.catch)
                  return promise
                    .then(() => {
                      throw new Error('')
                    })
                    .catch(err => assert.deepEqual(err, { isDetached: true }))
                })
              )
            )
      },
      {
        use: {
          props: true,
          state: true,
          render: true,
          update: true
        }
      }
    )

    const wrapper = Enzyme.mount(<Hoge {...{ store }} />)
    return Promise.resolve(
      store.dispatch(NAME, { unmount: () => wrapper.unmount() })
    )
  })
})

describe('Orph.prototype.getLatestState', () => {
  class Fuga extends Component {
    constructor(props) {
      super(props)
      this.props.store.attach(this, { inherit: true })
    }
    componentWillUnmount() {
      this.props.store.detach()
    }
    render() {
      return false
    }
  }

  const initialState = { obj: { key: 'value' } }

  const createStore = () => {
    const store = new Orph(initialState)

    store.register(
      {
        CHANGE_OBJ: (nextObj, { render }) => render({ obj: nextObj })
      },
      {
        use: { render: true }
      }
    )

    return store
  }

  it('before mount', () => {
    const store = createStore()

    const latestObjBeforeRewrite = store.getLatestState('obj')
    assert.deepEqual(latestObjBeforeRewrite, initialState.obj)
    assert.notStrictEqual(latestObjBeforeRewrite, initialState.obj)

    // rewrite
    latestObjBeforeRewrite.key = 'another'

    const latestObjAfterRewrite = store.getLatestState('obj')
    assert.notDeepEqual(latestObjAfterRewrite, latestObjBeforeRewrite)
    assert.deepEqual(latestObjAfterRewrite, initialState.obj)
  })

  it('changed after mount', async () => {
    const store = createStore()
    const wrapper = Enzyme.mount(<Fuga {...{ store }} />)

    const nextObj = ['value']
    await store.dispatch('CHANGE_OBJ', nextObj)
    // render({ obj: nextObj })

    const latestObj = store.getLatestState('obj')
    assert.notDeepEqual(latestObj, initialState.obj)
    assert.deepEqual(latestObj, nextObj)

    // reference
    assert.notStrictEqual(store.getLatestState('obj', true), latestObj)
    assert.strictEqual(store.getLatestState('obj', true), nextObj)

    // unmount
    wrapper.unmount()
    assert.strictEqual(store.getLatestState('obj', true), nextObj)
  })
})
