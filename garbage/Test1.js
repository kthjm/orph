import assert from "assert";
import React from "react";
import Orph from "../src/index.js";
import Atra from "atra";

const virtualReact = {
    state: {},
    setState(obj){
        this.state = obj;
    }
}


export default class Test1 extends React.Component {

    render(){return(<div {...atra("div",this.argux)} />)}

    constructor(props){
        super(props);
        this.state = {obj: {},arr: []};
    }
    componentWillMount(){
        this.argux = create(this);
    }
    componentDidMount(){}
    componentWillReceiveProps(nextprops){}
    componentWillUpdate(nextprops,nextstate){}
    componentDidUpdate(preprops,prestate){

        if(shouldDiff){
            assert(prestate.obj !== this.state.obj);
            // assert(prestate.arr !== this.state.arr);
        }
    }
    componentWillUnmount(){
        // windowEvents.forEach((type)=>(window.removeEventListener(type,this.argux)));
        if(removeWorkerListener) removeWorkerListener(this.argux);
        this.argux = null;
    }
}

var shouldDiff;

const {create,removeWorkerListener} = Orph([
    {cause: "window",nodes: []},
    {cause: "path",nodes: []},
    {cause: "react",nodes: [
        {
            condition: {
                type: "didupdate",
                listenerName: "testDidUpdate"
            },
            stateKeys: [],
            business:(e,clone,methods)=>{
            }
        }
    ]},
    {cause: "dom",nodes: [
        {
            condition: {
                type: "click",
                id: "theDiv",
                ww: true
            },
            stateKeys: [],
            business:(e,clone,{set,send,post})=>{
                assert(post);
                // console.log(post);
                post({
                    name: "testWorker",
                    mail: "fuck you"
                });
            }
        }
    ]},
    {cause: "worker",nodes: [
        {
            condition: {
                type: "message",
                listenerName: "testWorker"
            },
            stateKeys: ["obj","arr"],
            business:({data:{mail}},clone,{set,render})=>{
                assert(mail == "fuck you");
                set("obj",{});
                shouldDiff = true;
                render();
            }
        }
    ]}
]);

const atra = Atra({
    div:(argux)=>({
        id: "theDiv",
        onClick: argux
    })
})


// import assert from "assert";
// export const windowEvents = Object.keys(window).filter((key)=>(key.slice(0,2) == "on"));
//
// const testBusiness = (e,clone,methods) => {
//     // console.log(e.type);
//     if(e.type == "onstorage"){
//         let {set,render,post} = methods;
//         assert(post === undefined);
//         set("obj",{});
//         render();
//     }
// };
//
// const windowNodes = windowEvents.map((type)=>({
//     condition: {
//         type: type
//     },
//     stateKeys: ["obj","arr"],
//     business: testBusiness
// }));
//
// export const causes = [{cause:"window",nodes:windowNodes}];
