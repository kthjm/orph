# orph
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/kthjm/orph.svg?branch=master)](https://travis-ci.org/kthjm/orph)
[![Coverage Status](https://coveralls.io/repos/github/kthjm/orph/badge.svg)](https://coveralls.io/github/kthjm/orph)

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
    ['NAME_2', listener2, { states: [ 'bar' ] }]
])

orph.add('NAME_3', listener3, { dispatches: [ 'NAME_1' ] })

export default class Root extends React.Component {
    constructor(props){
        super(props)
        this.state = { foo: true, bar: 0 }
    }
    componentWillMount(){
        orph.attach(this)
        this.divOnClick = orph.create('NAME_3')
    }
    render(){
        return <div onClick={this.divOnClick} />
    }
    componentDidMount(){
        orph.dispatch('NAME_2', {/* data */})
    }
    componentWillUnmount(){
        orph.detach()
    }
}
```
```js
const listener = (e | data, methods) => {
    methods.props()
    methods.state()
    methods.render()
    methods.dispatch()
}
```
## API
### new Orph()
#### `.add()`
##### options
###### `states`
###### `dispatches`
#### `.attach()`
#### `.detach()`
#### `.create()`
#### `.dispatch()`
#### `.list()`

### methods as second argument
#### `props()`
#### `state()`
#### `render()`
#### `dispatch()`
## License
MIT (http://opensource.org/licenses/MIT)
