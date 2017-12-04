import assert from 'power-assert'
import Orph from '../src'

describe(`succeed`, () => {
  it(`options.states`, async () => {
    const orph = new Orph()
    orph.add('NAME', listener, { states: ['hoge'] })
    orph.attach({ setState, forceUpdate })

    const nextState = {}
    const callback = () => {}
    const data = {}
    await orph.dispatch('NAME', data)

    function listener(e, utils) {
      assert.deepStrictEqual(e, data)

      utils.render(nextState, callback)
      utils.update(callback)
    }

    function setState(partialState, cb) {
      assert.deepStrictEqual(partialState, nextState)
      assert.deepStrictEqual(cb, callback)
    }

    function forceUpdate(cb) {
      assert.deepStrictEqual(cb, callback)
    }
  })

  it(`options.dispatches`, async () => {
    const orph = new Orph()
    orph.add('NAME', listener, { dispatches: ['FUGA'] })
    orph.add('FUGA', fuga)
    orph.attach({ setState() {}, forceUpdate() {} })

    const data1 = {}
    const data2 = {}
    await orph.dispatch('NAME', data1)

    function listener(e, utils) {
      assert.deepStrictEqual(e, data1)
      utils.dispatch('FUGA', data2)
    }
    function fuga(e, utils) {
      assert.deepStrictEqual(e, data2)
    }
  })

  it(`orph.list()`, () => {
    const orph = new Orph([
      ['FOO', () => {}],
      ['BAR', () => {}, { states: ['hoge'] }],
      ['BAA', () => {}, { dispatches: ['fuga'] }]
    ])
    assert.deepEqual(orph.list(), {
      FOO: { states: undefined, dispatches: undefined },
      BAR: { states: ['hoge'], dispatches: undefined },
      BAA: { states: undefined, dispatches: ['fuga'] }
    })
  })
})
