import rewire from "rewire";
import sinon from "sinon";
import assert from "assert";

describe("orph unit test.",()=>{

    describe("nodeClasses",()=>{

        const rewired = rewire("../../src/nodeClasses.js");

        it("Node",()=>{
            const getted = rewired.__get__("Node");
        })

        it("dom",()=>{
            const getted = rewired.default.dom;
        })

        it("window",()=>{
            const getted = rewired.default.window;
        })

        it("path",()=>{
            const getted = rewired.default.path;
        })

        it("react",()=>{
            const getted = rewired.default.react;
        })

        it("worker",()=>{
            const getted = rewired.default.worker;
        })

    })

    describe("causeClasses",()=>{

        const rewired = rewire("../../src/causeClasses.js");

        it("Cause",()=>{
            const getted = rewired.__get__("Cause");
        })

    })

    describe("orph",()=>{

        const rewired = rewire("../../src/orph.js");

        it("addMessageListenerNeed",()=>{
            const getted = rewired.__get__("addMessageListenerNeed");
        })

    })

    describe("createLater",()=>{

        const rewired = rewire("../../src/createLater.js");

        it("create",()=>{
            const getted = rewired.create;
        })

        it("CustomMap",()=>{
            const getted = rewired.__get__("CustomMap");
        })

        it("orderRender",()=>{
            const getted = rewired.__get__("orderRender");
        })

        it("argus",()=>{
            const getted = rewired.__get__("argus");
        })

        it("comeBusiness",()=>{
            const getted = rewired.__get__("comeBusiness");
        })

        it("orderClone",()=>{
            const getted = rewired.__get__("orderClone");
        })

        it("orderSet",()=>{
            const getted = rewired.__get__("orderSet");
        })

    })

})
