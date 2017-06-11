// @flow

import nodeClasses from "./nodeClasses.js";

class Cause {

    constructor({cause,nodes}){

        this.nodes = nodes.map((node)=>{
            let NodeClass = nodeClasses[cause];
            return new NodeClass(node);
        });

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

            if(typeof currentTarget != "object" || currentTarget.constructor !== window.Worker) return true;

        }

    },

}
