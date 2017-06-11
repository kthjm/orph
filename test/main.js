import assert from "assert";
import Orph from "../src/index.js";
// import React from "react";
// import {shallow} from "enzyme";
// import {mount} from "enzyme";
// import Test1 from "./Test1.js";
// import incompleteCauses from "./incompleteCauses.js";

describe("five causes work in orph(or not)",()=>{

    it("window",()=>{
        const {create,removeWorkerListener} = Orph([
            {cause: "window", nodes:[
                {
                    condition: {
                        type: "resize",
                        // ww: true
                    },
                    stateKeys: [],
                    business(e,clone,{set,render,post}){
                        assert(!post);
                    }
                }
            ]},
            // {cause: "worker", nodes:[
            //     {
            //         condition: {
            //             type: "message",
            //             listenerName: "test"
            //         },
            //         stateKeys: [],
            //         business:(e,clone,{set,render,post})=>{}
            //     }
            // ]}
        ]);
        assert(!removeWorkerListener);
        const argus = create({state: {},setState(){}});
        window.addEventListener("resize",argus);
        window.dispatchEvent(new Event("resize"));
        window.removeEventListener("resize",argus);
    });

    it("dom",()=>{

    });

    it("path",()=>{
        const {create,removeWorkerListener} = Orph([
            {cause: "path", nodes:[
                {
                    condition: {
                        type: "popstate",
                        path: "/"
                        // ww: true
                    },
                    stateKeys: [],
                    business(e,clone,{set,render,post}){
                        console.log("path");
                        assert(!e);
                    }
                }
            ]}
        ]);
        assert(!removeWorkerListener);
        const argus = create({state: {},setState(){}});
        window.addEventListener("popstate",argus);
        window.dispatchEvent(new PopStateEvent("popstate"));
        window.removeEventListener("popstate",argus);
    });

    it("react",()=>{

    });

    // it("",()=>{
    //     // const wrapper = shallow(<Test1 />,{lifecycleExperimental:true});
    //     const wrapper = mount(<Test1 />);
    //     console.log(wrapper.find("#theDiv"));
    //     wrapper.find("#theDiv").simulate("click");
    // })

});


// const causes = incompleteCauses.map(({cause,nodes})=>({
//     cause: cause,
//     nodes: nodes.map((node)=>{
//         node.business = testBusiness;
//         return node;
//     })
// }));
//
// const equals = incompleteCauses.map(({cause,nodes})=>(
//     nodes.map(({condition,stateKeys})=>({
//         e:new CustomEvent(condition.type,{
//             currentTarget:(
//
//                 (cause == "window" || cause == "path") ? window
//
//                 :(cause == "dom") ? ((div)=>{
//                     let {id,className} = condition;
//                     let [attrName,attrData] = ((id) ? ["id",id] : ["class",className]);
//                     div.setAttribute(attrName,attrData);
//                     console.log(div);
//                     return div;
//                 })(document.createElement("div"))
//
//                 :(cause == "worker") ? {constructor:window.Worker}
//
//                 :false
//
//             ),
//             data: (cause != "worker") ? false : {
//                 listenerName: condition.listenerName
//             },
//             reactLifeCycle: (cause == "react")
//         }),
//         stateKeys:stateKeys
//     }))
// ));
//
//
// const {create,removeWorkerListener} = Orph(causes);
//
// it("",()=>{
//     const argus = create({
//         state: {
//             a: {},
//             b: [],
//             c: 100,
//             d: "orph"
//         },
//         setState(cloneToObject){}
//     });
//     console.log(equals);
//     equals.forEach((equal)=>{
//         equal.forEach(({e})=>{
//             console.log(e);
//             // argus(e);
//         })
//     })
// })
