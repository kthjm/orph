"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeClasses = require("./nodeClasses.js");

var _nodeClasses2 = _interopRequireDefault(_nodeClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cause = function Cause(_ref) {
    var cause = _ref.cause,
        nodes = _ref.nodes;

    _classCallCheck(this, Cause);

    var NodeClass = _nodeClasses2.default[cause];
    this.nodes = nodes.map(function (node) {
        return new NodeClass(node);
    });
};

exports.default = {

    "dom": function (_Cause) {
        _inherits(dom, _Cause);

        function dom(node) {
            _classCallCheck(this, dom);

            return _possibleConstructorReturn(this, (dom.__proto__ || Object.getPrototypeOf(dom)).call(this, node));
        }

        _createClass(dom, [{
            key: "prevent",
            value: function prevent(_ref2) {
                var currentTarget = _ref2.currentTarget;

                if (!currentTarget) return true;
                if (currentTarget === window) return true;
                if (!currentTarget.nodeName) return true;
            }
        }]);

        return dom;
    }(Cause),

    "window": function (_Cause2) {
        _inherits(_class, _Cause2);

        function _class(node) {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, node));
        }

        _createClass(_class, [{
            key: "prevent",
            value: function prevent(_ref3) {
                var currentTarget = _ref3.currentTarget;

                if (!currentTarget) return true;
                if (currentTarget !== window) return true;
            }
        }]);

        return _class;
    }(Cause),

    "path": function (_Cause3) {
        _inherits(path, _Cause3);

        function path(node) {
            _classCallCheck(this, path);

            return _possibleConstructorReturn(this, (path.__proto__ || Object.getPrototypeOf(path)).call(this, node));
        }

        _createClass(path, [{
            key: "prevent",
            value: function prevent(_ref4) {
                var currentTarget = _ref4.currentTarget;

                if (!currentTarget) return true;
                if (currentTarget !== window) return true;
            }
        }]);

        return path;
    }(Cause),

    "react": function (_Cause4) {
        _inherits(react, _Cause4);

        function react(node) {
            _classCallCheck(this, react);

            return _possibleConstructorReturn(this, (react.__proto__ || Object.getPrototypeOf(react)).call(this, node));
        }

        _createClass(react, [{
            key: "prevent",
            value: function prevent(_ref5) {
                var reactLifeCycle = _ref5.reactLifeCycle;

                if (!reactLifeCycle) return true;
            }
        }]);

        return react;
    }(Cause),

    "worker": function (_Cause5) {
        _inherits(worker, _Cause5);

        function worker(node) {
            _classCallCheck(this, worker);

            return _possibleConstructorReturn(this, (worker.__proto__ || Object.getPrototypeOf(worker)).call(this, node));
        }

        _createClass(worker, [{
            key: "prevent",
            value: function prevent(_ref6) {
                var currentTarget = _ref6.currentTarget;

                if ((typeof currentTarget === "undefined" ? "undefined" : _typeof(currentTarget)) != "object") return true;
                if (currentTarget.constructor !== window.Worker) return true;
            }
        }]);

        return worker;
    }(Cause)

};
module.exports = exports["default"];