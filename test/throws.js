import assert from 'power-assert'
import Orph from '../src'

describe(`throws until listener run`, () => {
  it(`add/create/dispatch(name: false | !string)`, () => {
    const orph = new Orph()
    const { add, create, dispatch } = new Orph()
    test('add')
    test('create')
    test('dispatch')
    function test(method) {
      const invalidNames = ['', 10, true, undefined, null, {}, [], () => {}]
      invalidNames.forEach(invalidName =>
        assert.throws(() => orph[method](invalidName), /Error: /)
      )
    }
  })

  it(`add(name, listener: !function)`, () => {
    const orph = new Orph()
    const invalidListeners = ['str', 10, true, undefined, null, {}, []]
    invalidListeners.forEach(invalidListener =>
      assert.throws(
        () => orph.add(`NAME`, invalidListener),
        /Error: orph.add argument "listener" is/
      )
    )
  })

  it(`create() before attach`, () => {
    const orph = new Orph()
    assert.throws(() => orph.create('NAME'), /Error: not active but create()/)
  })

  it(`dispatch() before attach`, () => {
    const orph = new Orph()
    assert.throws(
      () => orph.dispatch('NAME'),
      /Error: not active but dispatch()/
    )
  })

  it(`dispatch() after detach`, async () => {
    const orph = new Orph()
    orph.add('NAME', (data, utils) => {})
    orph.attach({
      setState: () => {},
      props: {},
      state: {}
    })

    await orph.dispatch('NAME')

    orph.detach()

    try {
      await orph.dispatch('NAME')
    } catch (err) {
      assert.deepStrictEqual(err.message, `not active but dispatch()`)
    }
  })

  it(`attach(react.setState: false | !function)`, () => {
    const orph = new Orph()
    const invalidSetStates = ['str', 10, true, undefined, null, {}, []]
    invalidSetStates.forEach(invalidSetState =>
      assert.throws(
        () => orph.attach({ setState: invalidSetState }),
        /Error: react.setState is/
      )
    )
  })
})
describe(`throws later listener run`, () => {
  it(`methods.dispatch(name: !added)`, async () =>
    frame(undefined, async methods => {
      const cause = 'NOT_ADDED_NAME'
      const expectMessage = `methods.dispatch name is not added`
      try {
        await methods.dispatch(cause)
      } catch (err) {
        assert.deepStrictEqual(err.message, expectMessage)
      }
    }))

  it(`methods.dispatch(name) touch not register dispatches`, async () =>
    frame({ dispatches: ['VALID_NAME'] }, async methods => {
      const cause = 'INVALID_NAME'
      const expectMessage = `methods.dispatch touches dispatchName that is not registerd`
      try {
        await methods.dispatch(cause)
      } catch (err) {
        assert.deepStrictEqual(err.message, expectMessage)
      }
    }))

  it(`methods.render(nextState) touch not register states`, async () =>
    frame({ states: ['foo'] }, methods =>
      assert.throws(
        () => methods.render({ foo: false, bar: 20 }),
        /methods.render touches stateName that is not registerd/
      )
    ))

  async function frame(opts, test) {
    const orph = new Orph()
    orph.add('NAME', listener, opts)

    const stubReact = {
      setState() {},
      props: {
        hoge: 'value',
        fuga: false
      },
      state: {
        foo: true,
        bar: 10
      }
    }
    orph.attach(stubReact)

    const stubFirst = { type: 'click' }
    await orph.dispatch('NAME', stubFirst)

    async function listener(first, methods) {
      assert.deepStrictEqual(first, stubFirst)

      assert.ok(typeof methods.render === 'function')
      assert.ok(typeof methods.dispatch === 'function')
      assert.ok(typeof methods.state === 'function')
      assert.ok(typeof methods.props === 'function')

      const state = methods.state()
      assert.deepStrictEqual(state.foo, stubReact.state.foo)
      assert.deepStrictEqual(state.bar, stubReact.state.bar)
      assert.deepEqual(state, stubReact.state)

      const props = methods.props()
      assert.deepStrictEqual(props.hoge, stubReact.props.hoge)
      assert.deepStrictEqual(props.fuga, stubReact.props.fuga)
      assert.deepEqual(props, stubReact.props)

      await test(methods)
      return
    }
  }
})
