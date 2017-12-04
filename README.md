# orph

[![npm](https://img.shields.io/npm/v/orph.svg?style=flat-square)](https://www.npmjs.com/package/orph)
[![npm](https://img.shields.io/npm/dm/orph.svg?style=flat-square)](https://www.npmjs.com/package/orph)
[![Build Status](https://img.shields.io/travis/kthjm/orph.svg?style=flat-square)](https://travis-ci.org/kthjm/orph)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/orph.svg?style=flat-square)](https://codecov.io/github/kthjm/orph)
[![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/orph/dist/orph.min.js)

## Installation

```shell
yarn add orph
```

## Usage

```js
import React from 'react'

import Orph from 'orph'
import listener1 from './listener1'
import listener2 from './listener2'
import listener3 from './listener3'

const orph = new Orph([
  ['NAME_1', listener1],
  ['NAME_2', listener2, { states: ['bar'] }]
])

orph.add('NAME_3', listener3, { dispatches: ['NAME_1'] })

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = { foo: true, bar: 0 }
  }
  componentWillMount() {
    orph.attach(this)
    this.divOnClick = orph.create('NAME_3')
  }
  render() {
    return <div onClick={this.divOnClick} />
  }
  componentDidMount() {
    orph.dispatch('NAME_2', {})
  }
  componentWillUnmount() {
    orph.detach()
  }
}
```

```js
const listener = (e | data, utils) => {
    utils.props()
    utils.state()
    utils.render()
    utils.dispatch()
    utils.update()
}
```

## API

### new Orph()

#### `.add(name, listener, options)`

##### options

* `states`
* `dispatches`

#### `.attach(react)`

#### `.detach()`

#### `.create(name)`

#### `.dispatch(name[, packet])`

#### `.list()`

### Utils as second argument

#### `props()`

#### `state()`

#### `dispatch(name[, packet])`

#### `render()`

pass arg to `setState`

#### `update()`

pass arg to `forceUpdate`

## License

MIT (http://opensource.org/licenses/MIT)
