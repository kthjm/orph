// @flow

import PathToRegExp from "path-to-regexp";
// import type {node,condition,e} from "./arguxType.js";

class Node {

    constructor({condition,stateKeys,business}: node){
        (this: any).condition = condition;
        (this: any).stateKeys = stateKeys;
        (this: any).business = business;
    }

    prevent(e: e,clone: any){
        let {condition:{type,prevent}} = (this: any);
        if(e.type !== type) return true;
        if(prevent && prevent(e,Object.assign({},clone.toObject()))) return true;
        if(this.preventOfUnique(e,(this: any).condition)) return true;
    }

}

export default  {

    "dom" : class extends Node {

        constructor(node: node){super(node)}

        preventOfUnique({currentTarget}: e,{id,className}: condition){

            if(!id && !className) return true;

            if(id && id !== currentTarget.id) return true;

            if(className){
                if(!currentTarget.hasAttribute("class")) return true;
                if(currentTarget.getAttribute("class").indexOf(className) == -1) return true;
            }

        }

    },

    "window" : class extends Node {

        constructor(node: node){super(node)}

        preventOfUnique(){}

    },

    "path" : class extends Node {

        constructor(node: node){
            super(node);
            let {path} = node.condition;
            (this: any).determiner = PathToRegExp(path);
        }

        preventOfUnique(){

            if(!(this: any).determiner.exec(location.pathname)) return true;

        }

    },

    "react" : class extends Node {

        constructor(node: node){super(node)}

        preventOfUnique(e: e,{listenerName}: condition){

            if(!listenerName || e.listenerName !== listenerName) return true;

        }

    },

    "worker" : class extends Node {

        constructor(node: node){super(node)}

        preventOfUnique({data}: e,{listenerName}: condition){

            if(!listenerName || data.listenerName !== listenerName) return true;

        }

    },

};
