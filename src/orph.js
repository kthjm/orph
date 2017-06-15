// @flow
// import type {causebefore} from "./arguxType.js";

import causeClasses from "./causeClasses.js";
import {create,ww} from "./createLater.js";

const addMessageListenerNeed = (causes): boolean => {
    let includesWorker = Boolean(causes.filter(({cause})=>(cause == "worker")).length);
    if(includesWorker && !ww) console.error(`"Worker" can't be used, so can't use your workerNodes and "post" method.`)
    return includesWorker;
}

export default (causes) => {

    let closure = {
        realCauses: causes.map((_cause)=>{
            let {cause} = _cause;
            let CauseClass = causeClasses[cause];
            return new CauseClass(_cause);
        }),
        addWorkerNeed: addMessageListenerNeed(causes)
    };

    return{
        create:(react: react)=>(create.call(closure,react)),
        removeWorkerListener: (
            (!closure.addWorkerNeed)
            ? false
            : (argus)=>(ww.removeEventListener("message",argus))
        )
    };

}



// const sharedSet = (stateKeys,clone,key,val) => {
//
// }


// const [ww,postMessage] = (
//     (Worker)
//     ? [undefined,undefined]
//     : ((workerString)=>{
//         let ww = new Worker(URL.createObjectURL(new Blob([workerString])));
//         return [ww,ww.postMessage.bind(ww)];
//     })('self.addEventListener("message",(e)=>(postMessage(e.data)))')
// )
