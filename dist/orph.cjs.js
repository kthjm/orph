'use strict'

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

var slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = []
    var _n = true
    var _d = false
    var _e = undefined

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value)

        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      try {
        if (!_n && _i['return']) _i['return']()
      } finally {
        if (_d) throw _e
      }
    }

    return _arr
  }

  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i)
    } else {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance'
      )
    }
  }
})()

var toConsumableArray = function(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i]

    return arr2
  } else {
    return Array.from(arr)
  }
}

//

var REACT_KEYS = ['props', 'state', 'render', 'update']
var USABLE_KEYS = REACT_KEYS.concat(['dispatch'])

var isReturn = function isReturn(data) {
  return (
    (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ||
    data === null
  )
}
var isArr = Array.isArray
var cloneByRecursive = function cloneByRecursive(data) {
  return isReturn(data)
    ? data
    : isArr(data)
      ? data.map(function(content) {
          return cloneByRecursive(content)
        })
      : (function(obj) {
          Object.keys(data).forEach(function(key) {
            obj[key] = cloneByRecursive(data[key])
          })
          return obj
        })({})
}

var isObj = function isObj(data) {
  return (
    (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' &&
    !isArr(data) &&
    data !== null
  )
}
var isFnc = function isFnc(data) {
  return typeof data === 'function'
}
var isThrow = function isThrow(condition) {
  return condition
}

var throwing = function throwing(condition, message) {
  if (isThrow(condition)) {
    throw new Error(message)
  }
}

var Orph = (function() {
  function Orph(initialState) {
    var _this = this

    classCallCheck(this, Orph)

    throwing(
      !isObj(initialState),
      'Orph.prototype.constructor requires argument as "object" not others'
    )

    this._actions = new Map()
    this._initialState = cloneByRecursive(initialState)
    this._use = {
      dispatch: function dispatch(name, data) {
        return _this.dispatch(name, data)
      }
    }
  }

  createClass(Orph, [
    {
      key: '_fnToCancelable',
      value: function _fnToCancelable(fn) {
        var _this2 = this

        return function() {
          for (
            var _len = arguments.length, arg = Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            arg[_key] = arguments[_key]
          }

          return new Promise(function(resolve, reject) {
            return _this2._isAttached()
              ? resolve(fn.apply(undefined, arg))
              : reject({ isDetached: true })
          })
        }
      }
    },
    {
      key: 'register',
      value: function register(actions, options) {
        var _this3 = this

        throwing(
          !isObj(actions),
          'Orph.prototype.register requires first argument as "object" not others'
        )
        throwing(
          !isObj(options),
          'Orph.prototype.register requires second argument as "object" not others'
        )
        throwing(
          !isObj(options.use),
          'Orph.prototype.register second argument requires "use" property as "object" not others'
        )

        var use = options.use

        var useKeys = Object.keys(use).filter(function(key) {
          return USABLE_KEYS.indexOf(key) !== -1 && use[key] === true
        })
        var prefix = options.prefix || ''
        Object.entries(actions).forEach(function(_ref) {
          var _ref2 = slicedToArray(_ref, 2),
            name = _ref2[0],
            action = _ref2[1]

          return (
            isFnc(action) &&
            _this3._actions.set('' + prefix + name, {
              useKeys: useKeys,
              action: _this3._fnToCancelable(action)
            })
          )
        })
      }
    },
    {
      key: 'order',
      value: function order(names) {
        var _this4 = this

        throwing(
          Boolean(names) && !isArr(names),
          'Orph.prototype.order requires argument as "array"'
        )

        var listeners = {}
        var orderNames =
          names || [].concat(toConsumableArray(this._actions.keys()))
        orderNames.forEach(function(name) {
          listeners[name] = function(e) {
            if (isFnc(e.persist)) e.persist()
            _this4.dispatch(name, e)
          }
        })

        return listeners
      }
    },
    {
      key: 'list',
      value: function list() {
        var list = {}
        ;[]
          .concat(toConsumableArray(this._actions.entries()))
          .forEach(function(_ref3) {
            var _ref4 = slicedToArray(_ref3, 2),
              name = _ref4[0],
              useKeys = _ref4[1].useKeys

            list[name] = useKeys
          })
        return list
      }
    },
    {
      key: 'attach',
      value: function attach(r) {
        var _this5 = this

        var options =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

        throwing(!isFnc(r.setState), 'orph.attach must be passed react')

        this._escapeState = function() {
          return r.state
        }
        ;[
          [
            'props',
            function(name, reference) {
              return reference ? r.props[name] : cloneByRecursive(r.props[name])
            }
          ],
          [
            'state',
            function(name, reference) {
              return reference ? r.state[name] : cloneByRecursive(r.state[name])
            }
          ],
          [
            'render',
            function(partialState, callback) {
              return r.setState(partialState, callback)
            }
          ],
          [
            'update',
            function(callback) {
              return r.forceUpdate(callback)
            }
          ]
        ].forEach(function(_ref5) {
          var _ref6 = slicedToArray(_ref5, 2),
            key = _ref6[0],
            fn = _ref6[1]

          _this5._use[key] = _this5._fnToCancelable(fn)
        })

        r.state = options.inherit ? this._existState() : this._initialState
      }
    },
    {
      key: 'detach',
      value: function detach() {
        var _this6 = this

        this._preState = this._escapeState()
        delete this._escapeState
        REACT_KEYS.forEach(function(key) {
          return delete _this6._use[key]
        })
      }
    },
    {
      key: '_existState',
      value: function _existState() {
        return this._preState || this._initialState
      }
    },
    {
      key: '_isAttached',
      value: function _isAttached() {
        return isFnc(this._escapeState)
      }
    },
    {
      key: 'dispatch',
      value: function dispatch(name, data) {
        throwing(
          !this._actions.has(name),
          'Orph.prototype.dispatch passed ' +
            name +
            ' as name that is not retisterd'
        )

        var actionObject = this._actions.get(name)
        return actionObject.action(data, this._createUse(actionObject.useKeys))
      }
    },
    {
      key: '_createUse',
      value: function _createUse(useKeys) {
        var _this7 = this

        var use = {}
        useKeys.forEach(function(key) {
          use[key] = _this7._use[key]
        })
        return use
      }
    },
    {
      key: 'getLatestState',
      value: function getLatestState(key, reference) {
        var referenceValue = this._isAttached()
          ? this._escapeState()[key]
          : this._existState()[key]

        return reference ? referenceValue : cloneByRecursive(referenceValue)
      }
    }
  ])
  return Orph
})()

module.exports = Orph
