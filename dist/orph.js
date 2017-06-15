"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _causeClasses = require("./causeClasses.js");

var _causeClasses2 = _interopRequireDefault(_causeClasses);

var _createLater = require("./createLater.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import type {causebefore} from "./arguxType.js";

var addMessageListenerNeed = function addMessageListenerNeed(causes) {
    var includesWorker = Boolean(causes.filter(function (_ref) {
        var cause = _ref.cause;
        return cause == "worker";
    }).length);
    if (includesWorker && !_createLater.ww) console.error("\"Worker\" can't be used, so can't use your workerNodes and \"post\" method.");
    return includesWorker;
};

exports.default = function (causes) {

    var closure = {
        realCauses: causes.map(function (_cause) {
            var cause = _cause.cause;

            var CauseClass = _causeClasses2.default[cause];
            return new CauseClass(_cause);
        }),
        addWorkerNeed: addMessageListenerNeed(causes)
    };

    return {
        create: function create(react) {
            return _createLater.create.call(closure, react);
        },
        removeWorkerListener: !closure.addWorkerNeed ? false : function (argus) {
            return _createLater.ww.removeEventListener("message", argus);
        }
    };
};

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


module.exports = exports["default"];