import rewire from "rewire";

const nodeClasses = rewire("../src/nodeClasses.js");

console.log(nodeClasses);

test = nodeClasses.__get__("test");

console.log(test);
