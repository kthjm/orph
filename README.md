# orph

**`orph` is listener manager to aim component-driven development of `React`.**

```js:1.js
import Orph from "orph";
const {create,removeWorkerListener} = Orph(causes);

export default class Hoge extends React.Component {
  componentWillMount(){
    this.listener = create(this);
  }
  componentDidMount(){
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
`this.listener` means all listeners you defined.

`causes` is array include containers storing listeners. the containers is divided by five cause.

```js:causes.js
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

```js:nodes.js
{
  condition: {},
  stateKeys: [],
  business: (e,clone,methods)=>{}
}
```

`condition` is object stored conditional information of the listener. It varies by its cause. explain below.  
`stateKeys` is array includes keys of your component. the keys determining on `clone`.  
`business` is a listener. `e` is the `e`. `clone` is your component state filterd by `stateKeys`. methods are `{set,render,post}`.

