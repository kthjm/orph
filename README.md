# orph

[![npm](https://img.shields.io/npm/v/orph.svg?style=flat-square)](https://www.npmjs.com/package/orph)
[![npm](https://img.shields.io/npm/dm/orph.svg?style=flat-square)](https://www.npmjs.com/package/orph)
[![Build Status](https://img.shields.io/travis/kthjm/orph.svg?style=flat-square)](https://travis-ci.org/kthjm/orph)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/orph.svg?style=flat-square)](https://codecov.io/github/kthjm/orph)
[![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/orph/dist/orph.min.js)

Design actions by restricting authority.

## Installation

```shell
yarn add orph
```

## Usage

```js
import React, { Component } from 'react'
import Orph from 'orph'

const store = new Orph({ count: 0 })

store.register({
  UP: (e, { state, render }) =>
    state('count')
    .then(count => count + 1)
    .then(count => render({ count })),

  DOWN: (e, { state, render }) =>
    state('count')
    .then(count => count - 1)
    .then(count => render({ count })),
},{
  prefix: 'RENDER:',
  use: { state: true, render: true }
})

const listeners = store.order()

class App extends Component {
  constructor(props) {
    super(props)
    store.attach(this, { inherit: true })
  }
  componentWillUnmount() {
    store.detach()
  }
  render() {
    return (
      <main>
        <h1>{this.state.count}</h1>
        <button onClick={listeners['RENDER:UP']}>+</button>
        <button onClick={listeners['RENDER:DOWN']}>-</button>
      </main>
    )
  }
}
```

## API

#### new Orph(initialState)

`initialState` is set to react when attached and will be never changed.

#### orph.register(actions, options)

##### options

* `use`

required to restrict authority of use.

* `prefix`

string added to name head.

```js
{
  FOO: (data, { render }) => console.log(render) // undefined
},{
  use: {
    dispatch: true
  }
}
```

#### orph.order(void | Array<name>): { [name]: listener }
return object contain listener format function.
```js
store.register({
  FOO: (data, { render }) => {}
},{
  use: { render: true }
})

const listeners = store.order()
// listeners['FOO']: (e) => store.dispatch('FOO', e)
```

#### orph.attach(react, options)
used in `constructor`.

##### options
* `inherit`: boolean
set `preState` to `react.state`.

#### orph.detach()
used in `componentWillUnmount`. Extract instance state as `preState`.

#### orph.dispatch(name[, data]): Promise<Action$Result>
same as below.

#### orph.list(): { [name]: useKeys }
util for debug.

#### orph.getLatestState(key[, reference]): StateValue

### Use

#### props(key[, reference]): Promise<PropsValue>
#### state(key[, reference]): Promise<StateValue>
cloned by default.
if `reference` is `true`, not be cloned that is passed directly.

#### render(): Promise<void>
pass arg to `setState`.

#### update(): Promise<void>
pass arg to `forceUpdate`

#### dispatch(name[, data]): Promise<Action$Result>
the result is passed by `then`.
```js
{
  THOUSAND_TIMES: ({ count }, { dispatch }) => count * 1000,
  BUTTON_CLICK: (n, { props, dispatch }) =>
    dispatch('UTIL:THOUSAND_TIMES', { count: props('count') })
    .then((multiplied) => dispatch('RENDER:COUNT', multiplied))
},{
  prefix: 'UTIL:',
  use: { dispatch: true, props: true }
}
```
All functions registerd can be connected by `dispatch`.

#### .catch(err)
`Use` process will be canceled if run after `orph.detach`.
```js
state('key')
.then(value => console.log(value))
.catch(err => console.log(err)) // { isDetached: true }
```

## License

MIT (http://opensource.org/licenses/MIT)
