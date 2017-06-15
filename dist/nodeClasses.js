"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require("path-to-regexp");

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import type {node,condition,e} from "./arguxType.js";

var Node = function () {
    function Node(_ref) {
        var condition = _ref.condition,
            stateKeys = _ref.stateKeys,
            business = _ref.business;

        _classCallCheck(this, Node);

        this.condition = condition;
        this.stateKeys = stateKeys;
        this.business = business;
    }

    _createClass(Node, [{
        key: "prevent",
        value: function prevent(e, clone) {
            var _ref2 = this,
                _ref2$condition = _ref2.condition,
                type = _ref2$condition.type,
                prevent = _ref2$condition.prevent;

            if (e.type !== type) return true;
            if (prevent && prevent(e, Object.assign({}, clone.toObject()))) return true;
            if (this.preventOfUnique(e, this.condition)) return true;
        }
    }]);

    return Node;
}();

exports.default = {

    "dom": function (_Node) {
        _inherits(dom, _Node);

        function dom(node) {
            _classCallCheck(this, dom);

            return _possibleConstructorReturn(this, (dom.__proto__ || Object.getPrototypeOf(dom)).call(this, node));
        }

        _createClass(dom, [{
            key: "preventOfUnique",
            value: function preventOfUnique(_ref3, _ref4) {
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
        }]);

        return dom;
    }(Node),

    "window": function (_Node2) {
        _inherits(window, _Node2);

        function window(node) {
            _classCallCheck(this, window);

            return _possibleConstructorReturn(this, (window.__proto__ || Object.getPrototypeOf(window)).call(this, node));
        }

        _createClass(window, [{
            key: "preventOfUnique",
            value: function preventOfUnique() {}
        }]);

        return window;
    }(Node),

    "path": function (_Node3) {
        _inherits(path, _Node3);

        function path(node) {
            _classCallCheck(this, path);

            var _this3 = _possibleConstructorReturn(this, (path.__proto__ || Object.getPrototypeOf(path)).call(this, node));

            var _path = node.condition.path;

            _this3.determiner = (0, _pathToRegexp2.default)(_path);
            return _this3;
        }

        _createClass(path, [{
            key: "preventOfUnique",
            value: function preventOfUnique() {

                if (!this.determiner.exec(location.pathname)) return true;
            }
        }]);

        return path;
    }(Node),

    "react": function (_Node4) {
        _inherits(react, _Node4);

        function react(node) {
            _classCallCheck(this, react);

            return _possibleConstructorReturn(this, (react.__proto__ || Object.getPrototypeOf(react)).call(this, node));
        }

        _createClass(react, [{
            key: "preventOfUnique",
            value: function preventOfUnique(e, _ref5) {
                var listenerName = _ref5.listenerName;


                if (!listenerName || e.listenerName !== listenerName) return true;
            }
        }]);

        return react;
    }(Node),

    "worker": function (_Node5) {
        _inherits(worker, _Node5);

        function worker(node) {
            _classCallCheck(this, worker);

            return _possibleConstructorReturn(this, (worker.__proto__ || Object.getPrototypeOf(worker)).call(this, node));
        }

        _createClass(worker, [{
            key: "preventOfUnique",
            value: function preventOfUnique(_ref6, _ref7) {
                var data = _ref6.data;
                var listenerName = _ref7.listenerName;


                if (!listenerName || data.listenerName !== listenerName) return true;
            }
        }]);

        return worker;
    }(Node)

};
module.exports = exports["default"];