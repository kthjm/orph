"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var workerString = 'self.addEventListener("message",(e)=>(postMessage(e.data)))';
var ww = exports.ww = typeof Worker === "undefined" ? false : new Worker(URL.createObjectURL(new Blob([workerString])));
var postMessage = !ww ? false : ww.postMessage.bind(ww);

var CustomMap = Map;
CustomMap.prototype.toObject = function () {
    return [].concat(_toConsumableArray(this.entries())).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return _defineProperty({}, key, value);
    }).reduce(function (pre, cur) {
        return Object.assign(pre, cur);
    });
};

var create = exports.create = function create(react) {
    var state = react.state,
        setState = react.setState;


    if (this.clone) this.clone.clear();
    this.clone = new CustomMap(Object.entries(state));

    if (this.render) this.render = null;
    this.render = orderRender(setState.bind(react), this.clone);

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
        render = closureThis.render;


    var businessArg = [e, orderClone(stateKeys, clone), {
        set: orderSet(stateKeys, clone),
        render: render,
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
        return _defineProperty({}, stateKey, clone.get(stateKey));
    }).reduce(function (pre, cur) {
        return Object.assign(pre, cur);
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