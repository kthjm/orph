// @flow

import nodeClasses from "./nodeClasses.js";

class Cause {
    constructor({cause,nodes}){
        let NodeClass = nodeClasses[cause];
        this.nodes = nodes.map((node)=>(new NodeClass(node)));
    }
}

export default {

    "dom" : class extends Cause {

        constructor(node){super(node)}

        prevent({currentTarget}){
            if(!currentTarget) return true;
            if(currentTarget === window) return true;
            if(!currentTarget.nodeName) return true;
        }

    },

    "window" : class extends Cause {

        constructor(node){super(node)}

        prevent({currentTarget}){
            if(!currentTarget) return true;
            if(currentTarget !== window) return true;
        }

    },

    "path" : class extends Cause {

        constructor(node){super(node)}

        prevent({currentTarget}){
            if(!currentTarget) return true;
            if(currentTarget !== window) return true;
        }

    },

    "react" : class extends Cause {

        constructor(node){super(node)}

        prevent({reactLifeCycle}){
            if(!reactLifeCycle) return true;
        }

    },

    "worker" : class extends Cause {

        constructor(node){super(node)}

        prevent({currentTarget}){
            if(typeof currentTarget != "object") return true;
            if(currentTarget.constructor !== window.Worker) return true;
        }

    },

}
