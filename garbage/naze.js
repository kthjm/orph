// @flow
import Map from "collections/map"
import type {causebefore,CauseClass,NodeClass,e} from "./arguxType.js";
import {postMessage} from "./inlineWebWorker.js";

type react = {
    setState: (state: any) => void,
    state: any
}

export default (causes) => {

    let addWorkerNeed = addMessageListenerNeed(causes);

    let realCauses: Array<CauseClass> = causes.map((_cause)=>{

        let {cause} = _cause;
        let CauseClass = causeClasses[cause];
        return new CauseClass(_cause);

    });

    let orga = (react: react) => {

        let {state,setState} = react;

        let fromNaze = {realCauses:realCauses,addWorkerNeed:addWorkerNeed};
        let clone = new Map(Object.entries(state));
        let render = renderMaker(setState.bind(react),clone);

        let benefit = argusMaker(fromNaze,clone,render);

        return benefit;

    };

    return orga;

};

const argusMaker = (virtualThis) => ({
    worker:virtualThis.addWorkerNeed,
    argus:argus.bind(virtualThis)
});

const argus = (e) => {

    let {realCauses,clone,render} = this;

    realCauses.forEach((cause)=>{

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
                    render:render,
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

}

const addMessageListenerNeed = (causes) => (
    causes.map(({cause})=>(cause)).includes("worker")
);

const renderMaker = (setState,clone) => (
    () => (setState(clone.toObject()))
)

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
            console.error(`this business can't touch "${key}". registered is [${stateKeys}].`);
            return false;
        }
        return clone.set(key,val);
    }

);
