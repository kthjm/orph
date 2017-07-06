"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _nodeClasses = require("./nodeClasses.js");

var _nodeClasses2 = _interopRequireDefault(_nodeClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cause = function Cause(_ref) {
    var cause = _ref.cause,
        nodes = _ref.nodes;
    (0, _classCallCheck3.default)(this, Cause);

    var NodeClass = _nodeClasses2.default[cause];
    this.nodes = nodes.map(function (node) {
        return new NodeClass(node);
    });
};

exports.default = {

    "dom": function (_Cause) {
        (0, _inherits3.default)(dom, _Cause);

        function dom(node) {
            (0, _classCallCheck3.default)(this, dom);
            return (0, _possibleConstructorReturn3.default)(this, (dom.__proto__ || (0, _getPrototypeOf2.default)(dom)).call(this, node));
        }

        (0, _createClass3.default)(dom, [{
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
        (0, _inherits3.default)(_class, _Cause2);

        function _class(node) {
            (0, _classCallCheck3.default)(this, _class);
            return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, node));
        }

        (0, _createClass3.default)(_class, [{
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
        (0, _inherits3.default)(path, _Cause3);

        function path(node) {
            (0, _classCallCheck3.default)(this, path);
            return (0, _possibleConstructorReturn3.default)(this, (path.__proto__ || (0, _getPrototypeOf2.default)(path)).call(this, node));
        }

        (0, _createClass3.default)(path, [{
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
        (0, _inherits3.default)(react, _Cause4);

        function react(node) {
            (0, _classCallCheck3.default)(this, react);
            return (0, _possibleConstructorReturn3.default)(this, (react.__proto__ || (0, _getPrototypeOf2.default)(react)).call(this, node));
        }

        (0, _createClass3.default)(react, [{
            key: "prevent",
            value: function prevent(_ref5) {
                var reactLifeCycle = _ref5.reactLifeCycle;

                if (!reactLifeCycle) return true;
            }
        }]);
        return react;
    }(Cause),

    "worker": function (_Cause5) {
        (0, _inherits3.default)(worker, _Cause5);

        function worker(node) {
            (0, _classCallCheck3.default)(this, worker);
            return (0, _possibleConstructorReturn3.default)(this, (worker.__proto__ || (0, _getPrototypeOf2.default)(worker)).call(this, node));
        }

        (0, _createClass3.default)(worker, [{
            key: "prevent",
            value: function prevent(_ref6) {
                var currentTarget = _ref6.currentTarget;

                if ((typeof currentTarget === "undefined" ? "undefined" : (0, _typeof3.default)(currentTarget)) != "object") return true;
                if (currentTarget.constructor !== window.Worker) return true;
            }
        }]);
        return worker;
    }(Cause)

};
module.exports = exports["default"];