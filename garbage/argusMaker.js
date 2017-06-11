// @flow

import causeClasses from "./causeClasses.js"
import postMessage from "./postMessage.js"

import type {causebefore,CauseClass,NodeClass,e} from "./arguxType.js";

export default (causes: Array<causebefore>) => {

    let thisCauses: Array<CauseClass> = causes.map((_cause)=>{

        let {cause} = _cause;
        let CauseClass = causeClasses[cause];
        // let newCause: CauseClass  = new CauseClass(_cause);
        return new CauseClass(_cause);

    });

    return (function(e: e){

        let {clone,send} = (this: any);

        if(!clone) return false;

        thisCauses.forEach((cause)=>{

            if(cause.prevent(e)) return false;

            let {nodes} = cause;
            if(!nodes.length) return false;

            nodes.forEach((node)=>{

                if(node.prevent(e,clone)) return false;
                // if(e.persist) e.persist();

                let {condition,stateKeys,business}: node = node;

                let businessArg = [
                    e,
                    cloneMaker(stateKeys,clone),
                    {
                        set:setMaker(stateKeys,clone),
                        send:send,
                        post:(condition.ww) ? postMessage : undefined
                    }
                ];

                let {gentle,gentleTimer} = condition;

                if(!gentle) return business(...businessArg);

                if(gentleTimer){
                    clearTimeout(gentleTimer);
                    condition.gentleTimer = false;
                }

                if(e.persist) e.persist();

                condition.gentleTimer =  setTimeout(()=>(business(...businessArg)),gentle);

            });

        });

    })

};

const cloneMaker = (stateKeys,clone): any => {
    let obj = {};
    stateKeys.forEach((stateKey)=>{
        obj[stateKey] = clone.get(stateKey);
    });
    return obj;
};

const setMaker = (stateKeys,clone) => (

    function(key,val){
        if(!stateKeys.includes(key)){
            console.error(`this business can't touch ${key}. registered is ${stateKeys}.`);
            return false;
        }
        return clone.set(key,val);
    }

);
