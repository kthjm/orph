### orph



```js:Root.js
import React from "react";
import orph from "orph";
import causes from "./causes.js"

const {create,rmWorkerListener} = orph(causes);

export default class MyRoot extends React {

    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        this.augus = create(this);
        window.addEventListener("resize",this.augus);
    }

    componentWillUnmount(){
        if(rmWorkerListener) rmWorkerListener(this.augus);
        window.removeEventListener("resize",this.augus);
        this.augus = null;
    }

}
```

```js:a_cause.js
import orphDom from "orph-dom";

export default {
    cause: "dom",
    use: orphDom,
    orphans: [
        {
            condition: {},
            stateKeys: [],
            business: (e,clone,{set,send,post}) => {}
        },
        {...},
        {...},
        {...}
    ]
}
```

```js:stateless.js
import {atra} from "orph";

export default () => (
    <div {...a("div")}>
        <span {...a("span")}></span>
        <img {...a("img")} />
    </div>
);

const a = atra({
    div:{...},
    span:{...},
    img:{...}
});
```
