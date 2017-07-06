# orph
[![npm version](https://img.shields.io/npm/v/orph.svg)](https://www.npmjs.com/package/orph)
[![Build Status](https://travis-ci.org/kthjm/orph.svg?branch=master)](https://travis-ci.org/kthjm/orph)
[![Coverage Status](https://coveralls.io/repos/github/kthjm/orph/badge.svg?branch=master)](https://coveralls.io/github/kthjm/orph?branch=master)
[![Code Climate](https://codeclimate.com/github/kthjm/orph/badges/gpa.svg)](https://codeclimate.com/github/kthjm/orph)

**`orph` is listener manager to aim component-driven development of `React`.**

```sh
npm i --save orph
```
```sh
yarn add orph
```
```javascript
import Orph from "orph";
import causes from "./causes.js";
const {create,removeWorkerListener} = Orph(causes);
```

`listener` means all listeners defined in causes.

```javascript
import Orph from "orph";
import causes from "./causes.js";
const {create,removeWorkerListener} = Orph(causes);

export default class Hoge extends React.Component {
  componentWillMount(){
    this.listener = create(this);
    window.addEventListener("resize",this.listener);
  }
  render(){return(
    <div onClick={this.listener} />
  )}
  componentDidUpdate(preProps,preState){
    this.listener({
      reactLifeCycle: true,
      type: "didupdate",
      listenerName: "businessAtDidUpdate"
    });
  }
  componentWillUnmount(){
    window.removeEventListener("resize",this.listener);
    removeWorkerListener(this.listener);
    this.listener = null;
  }
}
```
`causes` is array include containers storing listeners. the containers is divided by five cause.

```javascript
const causes = [
  {cause:"dom",nodes:[{},{},{}]},
  {cause:"window",nodes:[{},{},{}]},
  {cause:"path",nodes:[{},{},{}]},
  {cause:"react",nodes:[{},{},{}]},
  {cause:"worker",nodes:[{},{},{}]}
];
```

the cause is one of `"dom"`,`"window"`,`"path"`,`"react"`,`"worker"` so far.

`node` is following.

```javascript
{
  condition: {},
  stateKeys: [],
  business: (e,clone,methods)=>{}
}
```

`condition` is object stored conditional information of the listener. It varies by its cause. explain below.

`stateKeys` is array includes keys of your component. the keys determining on `clone`.

`business` is a listener. `e` is the `e`. `clone` is your component state filterd by `stateKeys`. methods are `{set,render,post}`.
