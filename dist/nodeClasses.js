"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _pathToRegexp = require("path-to-regexp");

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import type {node,condition,e} from "./arguxType.js";

var Node = function () {
    function Node(_ref) {
        var condition = _ref.condition,
            stateKeys = _ref.stateKeys,
            business = _ref.business;
        (0, _classCallCheck3["default"])(this, Node);

        this.condition = condition;
        this.stateKeys = stateKeys;
        this.business = business;
    }

    (0, _createClass3["default"])(Node, [{
        key: "prevent",
        value: function () {
            function prevent(e, clone) {
                var _ref2 = this,
                    _ref2$condition = _ref2.condition,
                    type = _ref2$condition.type,
                    prevent = _ref2$condition.prevent;

                if (e.type !== type) return true;
                if (prevent && prevent(e, (0, _assign2["default"])({}, clone.toObject()))) return true;
                if (this.preventOfUnique(e, this.condition)) return true;
            }

            return prevent;
        }()
    }]);
    return Node;
}();

exports["default"] = {

    "dom": function (_Node) {
        (0, _inherits3["default"])(dom, _Node);

        function dom(node) {
            (0, _classCallCheck3["default"])(this, dom);
            return (0, _possibleConstructorReturn3["default"])(this, (dom.__proto__ || (0, _getPrototypeOf2["default"])(dom)).call(this, node));
        }

        (0, _createClass3["default"])(dom, [{
            key: "preventOfUnique",
            value: function () {
                function preventOfUnique(_ref3, _ref4) {
                    var currentTarget = _ref3.currentTarget;
                    var id = _ref4.id,
                        className = _ref4.className;


                    if (!id && !className) return true;

                    if (id && id !== currentTarget.id) return true;

                    if (className) {
                        if (!currentTarget.hasAttribute("class")) return true;
                        if (currentTarget.getAttribute("class").indexOf(className) == -1) return true;
                    }
                }

                return preventOfUnique;
            }()
        }]);
        return dom;
    }(Node),

    "window": function (_Node2) {
        (0, _inherits3["default"])(window, _Node2);

        function window(node) {
            (0, _classCallCheck3["default"])(this, window);
            return (0, _possibleConstructorReturn3["default"])(this, (window.__proto__ || (0, _getPrototypeOf2["default"])(window)).call(this, node));
        }

        (0, _createClass3["default"])(window, [{
            key: "preventOfUnique",
            value: function () {
                function preventOfUnique() {}

                return preventOfUnique;
            }()
        }]);
        return window;
    }(Node),

    "path": function (_Node3) {
        (0, _inherits3["default"])(path, _Node3);

        function path(node) {
            (0, _classCallCheck3["default"])(this, path);

            var _this3 = (0, _possibleConstructorReturn3["default"])(this, (path.__proto__ || (0, _getPrototypeOf2["default"])(path)).call(this, node));

            var _path = node.condition.path;

            _this3.determiner = (0, _pathToRegexp2["default"])(_path);
            return _this3;
        }

        (0, _createClass3["default"])(path, [{
            key: "preventOfUnique",
            value: function () {
                function preventOfUnique() {

                    if (!this.determiner.exec(location.pathname)) return true;
                }

                return preventOfUnique;
            }()
        }]);
        return path;
    }(Node),

    "react": function (_Node4) {
        (0, _inherits3["default"])(react, _Node4);

        function react(node) {
            (0, _classCallCheck3["default"])(this, react);
            return (0, _possibleConstructorReturn3["default"])(this, (react.__proto__ || (0, _getPrototypeOf2["default"])(react)).call(this, node));
        }

        (0, _createClass3["default"])(react, [{
            key: "preventOfUnique",
            value: function () {
                function preventOfUnique(e, _ref5) {
                    var listenerName = _ref5.listenerName;


                    if (!listenerName || e.listenerName !== listenerName) return true;
                }

                return preventOfUnique;
            }()
        }]);
        return react;
    }(Node),

    "worker": function (_Node5) {
        (0, _inherits3["default"])(worker, _Node5);

        function worker(node) {
            (0, _classCallCheck3["default"])(this, worker);
            return (0, _possibleConstructorReturn3["default"])(this, (worker.__proto__ || (0, _getPrototypeOf2["default"])(worker)).call(this, node));
        }

        (0, _createClass3["default"])(worker, [{
            key: "preventOfUnique",
            value: function () {
                function preventOfUnique(_ref6, _ref7) {
                    var data = _ref6.data;
                    var listenerName = _ref7.listenerName;


                    if (!listenerName || data.listenerName !== listenerName) return true;
                }

                return preventOfUnique;
            }()
        }]);
        return worker;
    }(Node)

};
module.exports = exports["default"];