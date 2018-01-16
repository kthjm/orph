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
  UP: (e, { state, render }) => render({ count: state('count') + 1 }),
  DOWN: (e, { state, render }) => render({ count: state('count') - 1 })
},{
  prefix: 'RENDER:',
  use: { state: true, render: true }
})

const listeners = store.order(['RENDER:UP', 'RENDER:DOWN'])

class App extends Component {
  constructor(props) {
    super(props)
    store.attach(this)
  }

  render() {
    const { count } = this.state

    return (
      <main>
        <h1>{count}</h1>
        <button onClick={listeners['RENDER:UP']}>+</button>
        <button onClick={listeners['RENDER:DOWN']}>-</button>
      </main>
    )
  }

  componentWillUnmount() {
    store.detach(true)
  }
}
```

## API

#### `new Orph(initialState)`

`initialState` is set to react when attached.

#### `.register(actions, options)`

##### options

* `prefix` string added to name head.

* `use`

For restricting authority.
```js
{
  FOO: (data, { render }) => console.log(render) // undefined
},{
  use: {
    dispatch: true
  }
}
```

#### `.order(Array<name>)`

#### `.attach(react)`

set `initialState` as `react.state`.

#### `.detach(save: boolean)`

used in `componentWillUnmount`. if `save`, set `react.state` as `initialState`.

#### `.dispatch(name[, data])`

same as below.

#### `.list()`

### Use

#### `props(name[, reference])`

#### `state(name[, reference])`
cloned by default.
if `reference` is `true`, not be cloned that is passed directly.

#### `render()`

pass arg to `setState`. this function doesn't change `initialState`.

#### `update()`

pass arg to `forceUpdate`

#### `dispatch(name[, data])`

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

All functions that registerd can be connected by `dispatch`.

## License

MIT (http://opensource.org/licenses/MIT)
