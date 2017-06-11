// import React from "react";
// import orph from "orph";
// import causes from "./causes.js";
//
// const {create,removeWorkerListener} = orph(causes);
//
// export default class MyRoot extends React {
//
//     constructor(props){
//         super(props);
//         this.state = {};
//     }
//
//     componentWillMount(){
//         this.argus = create(this);
//         window.addEventListener("resize",this.argus);
//     }
//
//     componentWillMount(){
//         if(removeWorkerListener) removeWorkerListener(this.argus);
//         window.addEventListener("resize",this.argus);
//         this.argus = null;
//     }
//
// }
