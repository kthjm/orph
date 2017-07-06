"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = exports.ww = undefined;

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var workerString = 'self.addEventListener("message",(e)=>(postMessage(e.data)))';
var ww = exports.ww = typeof Worker === "undefined" ? false : new Worker(URL.createObjectURL(new Blob([workerString])));
var postMessage = !ww ? false : ww.postMessage.bind(ww);

var CustomMap = _map2.default;
CustomMap.prototype.toObject = function () {
    return [].concat((0, _toConsumableArray3.default)(this.entries())).map(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return (0, _defineProperty3.default)({}, key, value);
    }).reduce(function (pre, cur) {
        return (0, _assign2.default)(pre, cur);
    });
};

var create = exports.create = function create(react) {
    var state = react.state,
        setState = react.setState,
        forceUpdate = react.forceUpdate;


    if (this.clone) this.clone.clear();
    this.clone = new CustomMap((0, _entries2.default)(state));

    if (this.render) this.render = null;
    this.render = orderRender(setState.bind(react), this.clone);

    if (this.update) this.update = null;
    this.update = forceUpdate.bind(react);

    var newArgus = argus.bind(this);
    if (this.addWorkerNeed) ww.addEventListener("message", newArgus);
    return newArgus;
};

var orderRender = function orderRender(setStateBinded, clone) {
    return function () {
        return setStateBinded(clone.toObject());
    };
};

var argus = function argus(e) {
    var _this = this;

    this.realCauses.filter(function (_ref4) {
        var nodes = _ref4.nodes,
            prevent = _ref4.prevent;
        return nodes.length && !prevent(e);
    }).forEach(function (_ref5) {
        var nodes = _ref5.nodes;
        return nodes.filter(function (node) {
            return !node.prevent(e, _this.clone);
        }).forEach(function (node) {
            return comeBusiness(e, node, _this);
        });
    });
};

var comeBusiness = function comeBusiness(e, node, closureThis) {
    var condition = node.condition,
        stateKeys = node.stateKeys,
        business = node.business;
    var clone = closureThis.clone,
        render = closureThis.render,
        update = closureThis.update;


    var businessArg = [e, orderClone(stateKeys, clone), {
        set: orderSet(stateKeys, clone),
        render: render,
        update: update,
        post: condition.ww ? postMessage : undefined
    }];

    if (!condition.gentle) return business.apply(undefined, businessArg);

    var gentle = condition.gentle,
        gentleTimer = condition.gentleTimer;

    if (gentleTimer) {
        clearTimeout(gentleTimer);
        condition.gentleTimer = false;
    }
    if (e.persist) e.persist();
    condition.gentleTimer = setTimeout(function () {
        return business.apply(undefined, businessArg);
    }, gentle);
};

var orderClone = function orderClone(stateKeys, clone) {

    if (!stateKeys.length) return {};
    return stateKeys.map(function (stateKey) {
        return (0, _defineProperty3.default)({}, stateKey, clone.get(stateKey));
    }).reduce(function (pre, cur) {
        return (0, _assign2.default)(pre, cur);
    });
};

var orderSet = function orderSet(stateKeys, clone) {
    return function (key, val) {
        if (!Boolean(stateKeys.filter(function (stateKey) {
            return stateKey == key;
        }).length)) {
            console.error("this business can't touch \"" + key + "\". registered is [" + stateKeys + "].");
            return false;
        }
        return clone.set(key, val);
    };
};