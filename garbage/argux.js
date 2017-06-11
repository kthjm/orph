// @flow

import naze from "./naze.js";
import {ww} from "./inlineWebWorker.js";

import type {causebefore} from "./arguxType.js";

export const orph = (causes) => {

    let stateOfPre = {
        addWorkerNeed: addMessageListenerNeed(causes),
        realCauses: causes.map((_cause)=>{
            let {cause} = _cause;
            let CauseClass = causeClasses[cause];
            return new CauseClass(_cause);
        })
    };

    return{
        create:(react: react)=>(create.call(stateOfPre,react)),
        removeWorkerListener: (
            (!stateOfPre.addWorkerNeed)
            ? false
            : (argus)=>(ww.removeEventListener("message",argus))
        )
    };

}

const create = (react) => {

    let {state,setState} = react;

    if(this.clone) this.clone.clear();
    this.clone = new Map(Object.entries(state));

    if(this.render) this.render = null;
    this.render = renderMaker(setState.bind(react),this.clone);

    let newArgus = argus.bind(this);
    if(this.addWorkerNeed) ww.addEventListener("message",newArgus);
    return newArgus;

}

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

// export class Argux {
//
//     constructor(causes: Array<causebefore>){
//         (this: any).create = naze(causes);
//         (this: any).create = this.create.bind(this);
//     }
//
//     create(react){
//         let {argus,worker} = this.create(react);
//         if(worker) ww.addEventListener("message",argus);
//         return argus;
//     }
//
// }



export default orph;


// Alloc.prototype.alloc = function(name,arg){
//
//     return (his=>{
//
//         if(!his) return {};
//
//         if(!arg) return {style:retort(his)};
//         // alloc("name")
//
//         if(typeof arg == "boolean") return retort(his);
//         // alloc("name",true)
//
//         if(typeof arg == "string" || typeof arg == "number")  return retort(his,arg);
//
//         if("style" in arg && Object.keys(arg).length == 1) return {style:retort(his,arg.style)};
//         // alloc("name",{style:{...}})
//
//         return retort(his,arg);
//         // alloc("name",{hoge:"hoge",style:{...}})
//
//     })(this.config[name]);
//
// }












// import EventEmitter from "eventemitter2"
// import argusMaker from "./argusMaker.js"

// const argux = Object.assign({},EventEmitter.prototype,{
//
//     // feed : {},
//     //
//     // recievemit(clone){
//     //     this.feed = null;
//     //     this.feed = clone;
//     //     return this.emit("recieve");
//     // },
//     //
//     // on(demand){
//     //     this.on("recieve",demand)
//     // },
//     //
//     // off(demand){
//     //     this.off("recieve",demand)
//     // },
//     // supply(){
//     //     return this.feed
//     // },
//
//     Argus : class {
//
//         constructor(causes: Array<causebefore>){
//             // ,name: string = "argus"
//
//             // let argus = argusMaker(causes);
//             // (this: any).argus = argus.bind(this);
//
//             (this: any).create = naze(causes);
//
//             (this: any).create = this.create.bind(this);
//             // (this: any).send = this.send.bind(this);
//             (this: any).fin = this.fin.bind(this);
//
//             // if(addMessageListenerNeed(causes)){
//             //     window.addEventListener("message",(this: any).argus);
//             // }
//
//         }
//
//         create(react: react){
//
//             let {argus,worker} = this.create(react);
//
//             if(worker) window.addEventListener("message",argus);
//
//             return argus;
//
//             // (this: any).clone = new Map(Object.entries(state));
//         }
//
//         // render(){
//         //     this.setState(this.clone.toObject())
//         // }
//
//         fin(){
//
//         }
//
//         // create(state){
//         //     (this: any).clone = new Map(Object.entries(state));
//         // }
//
//         // send(){
//         //     argux.snatchemit((this: any).clone.toObject());
//         // }
//
//         // fin(){
//         //     (this: any).clone.clear();
//         //     (this: any).clone = null;
//         // }
//
//     },
//
//     Attr(){}
//
// });

// const addMessageListenerNeed = (causes) => (causes.map(({cause})=>(cause))).includes("worker");

// argux.on = argux.on.bind(argux);
// argux.off = argux.off.bind(argux);
// argux.supply = argux.supply.bind(argux);
// export default argux;









// new Brother({
//     name:name,
//     causes:[
//         {
//             cause:"",
//             nodes:[]
//         },
//         {
//             cause:"",
//             commands:[]
//         },
//         {
//             cause:"",
//             commands:[]
//         }
//     ]
// });

// this.removeListener("recieve",demand);
// new Brother([
//
//     {
//         name:name,
//         causes:[
//             {
//                 cause:"",
//                 commands:[]
//             }
//         ]
//     },
//
//     {
//         name:name,
//         causes:[]
//     }
//
// ])


// let _workerExists = cqs.filter(({rcs})=>{
//     let causes = rcs.map(({cause})=>(cause));
//     return causes.includes("_worker");
// });
//
// return Boolean(_workerExists.length);
// sync(){
//     argux.syncemit(this.clone.toObject());
// }


// syncemit(clone){
//     this.feed = null;
//     this.feed = clone;
//     this.emit("sync");
// },
// on_sync(synced){
//     this.on("sync",synced);
// },
//
// off_sync(synced){
//     this.removeListener("sync",synced);
// },



// import {Map,set_rcs,cq} from "./fn";
// import Map from "collections/map";
