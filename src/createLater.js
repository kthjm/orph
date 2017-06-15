// @flow

const workerString = 'self.addEventListener("message",(e)=>(postMessage(e.data)))';
export const ww = (
    (typeof Worker === "undefined") ? false : (
        new Worker(URL.createObjectURL(new Blob([workerString])))
    )
);
const postMessage = (!ww) ? false : ww.postMessage.bind(ww);

const CustomMap = Map;
CustomMap.prototype.toObject = function(){return(
    [...this.entries()]
	.map(([key,value])=>({[key]: value}))
	.reduce((pre,cur)=>(Object.assign(pre,cur)))
)};

export const create = function(react){

    let {state,setState} = react;

    if(this.clone) this.clone.clear();
    this.clone = new CustomMap(Object.entries(state));

    if(this.render) this.render = null;
    this.render = orderRender(setState.bind(react),this.clone);

    let newArgus = argus.bind(this);
    if(this.addWorkerNeed) ww.addEventListener("message",newArgus);
    return newArgus;

}

const orderRender = (setStateBinded,clone) => (()=>(setStateBinded(clone.toObject())))

const argus = function(e){

    this.realCauses
    .filter(({nodes,prevent})=>(nodes.length && !prevent(e)))
    .forEach(({nodes})=>(

        nodes
        .filter((node)=>(!node.prevent(e,this.clone)))
        .forEach((node)=>(

            comeBusiness(e,node,this)

        ))

    ));

};

const comeBusiness = (e,node,closureThis) => {

    let {condition,stateKeys,business} = node;
    let {clone,render} = closureThis;

    let businessArg = [e,orderClone(stateKeys,clone),{
        set:orderSet(stateKeys,clone),
        render:render,
        post:(condition.ww) ? postMessage : undefined
    }];

    if(!condition.gentle) return business(...businessArg);

    let {gentle,gentleTimer} = condition;
    if(gentleTimer){
        clearTimeout(gentleTimer);
        condition.gentleTimer = false;
    }
    if(e.persist) e.persist();
    condition.gentleTimer =  setTimeout(()=>(business(...businessArg)),gentle);

}

const orderClone = (stateKeys,clone): any => {

    if(!stateKeys.length) return {};
    return(
        stateKeys
        .map((stateKey)=>({[stateKey]:clone.get(stateKey)}))
        .reduce((pre,cur)=>(Object.assign(pre,cur)))
    );

};

const orderSet = (stateKeys,clone) => (
    (key,val) => {
        if(!Boolean(stateKeys.filter((stateKey)=>(stateKey == key)).length)){
            console.error(`this business can't touch "${key}". registered is [${stateKeys}].`);
            return false;
        }
        return clone.set(key,val);
    }
);
