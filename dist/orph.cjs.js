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

var asserts = function asserts(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

var Orph = (function() {
  function Orph(initialState) {
    var _this = this

    classCallCheck(this, Orph)

    asserts(
      isObj(initialState),
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
      key: 'register',
      value: function register(actions, options) {
        var _this2 = this

        asserts(
          isObj(actions),
          'Orph.prototype.register requires first argument as "object" not others'
        )
        asserts(
          isObj(options),
          'Orph.prototype.register requires second argument as "object" not others'
        )
        asserts(
          isObj(options.use),
          'Orph.prototype.register second argument requires "use" property as "object" not others'
        )

        var prefix = options.prefix || ''
        var useKeys = USABLE_KEYS.filter(function(key) {
          return options.use[key] === true
        })
        Object.entries(actions).forEach(function(_ref) {
          var _ref2 = slicedToArray(_ref, 2),
            name = _ref2[0],
            action = _ref2[1]

          return (
            isFnc(action) &&
            _this2._actions.set('' + prefix + name, {
              useKeys: useKeys,
              action: action
            })
          )
        })
      }
    },
    {
      key: 'order',
      value: function order(names) {
        var _this3 = this

        asserts(
          isArr(names) || !names,
          'Orph.prototype.order requires argument as "array"'
        )

        var listeners = {}
        var orderNames =
          names || [].concat(toConsumableArray(this._actions.keys()))
        orderNames.forEach(function(name) {
          return (listeners[name] = function(e) {
            if (isObj(e) && isFnc(e.persist)) e.persist()
            return _this3.dispatch(name, e)
          })
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

            return (list[name] = useKeys)
          })
        return list
      }
    },
    {
      key: 'attach',
      value: function attach(r) {
        var options =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

        asserts(isFnc(r.setState), 'orph.attach must be passed react')

        this._escapeState = function() {
          return r.state
        }

        this._use.props = this._makeUseCancelable(function(name, reference) {
          return reference ? r.props[name] : cloneByRecursive(r.props[name])
        })

        this._use.state = this._makeUseCancelable(function(name, reference) {
          return reference ? r.state[name] : cloneByRecursive(r.state[name])
        })

        this._use.render = this._makeUseCancelable(function(
          partialState,
          callback
        ) {
          return r.setState(partialState, callback)
        })

        this._use.update = this._makeUseCancelable(function(callback) {
          return r.forceUpdate(callback)
        })

        r.state = options.inherit ? this._existState() : this._initialState
      }
    },
    {
      key: '_makeUseCancelable',
      value: function _makeUseCancelable(fn) {
        var _this4 = this

        return function() {
          for (
            var _len = arguments.length, arg = Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            arg[_key] = arguments[_key]
          }

          return new Promise(function(resolve, reject) {
            return _this4._isAttached()
              ? resolve(fn.apply(undefined, arg))
              : reject({ isDetached: true })
          })
        }
      }
    },
    {
      key: 'detach',
      value: function detach() {
        var _this5 = this

        this._preState = this._escapeState()
        delete this._escapeState
        REACT_KEYS.forEach(function(key) {
          return delete _this5._use[key]
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
        var _this6 = this

        asserts(
          this._actions.has(name),
          'Orph.prototype.dispatch passed ' +
            name +
            ' as name that is not retisterd'
        )

        var actionObject = this._actions.get(name)
        var action = actionObject.action,
          useKeys = actionObject.useKeys

        return Promise.resolve().then(function() {
          return action(data, _this6._createUse(useKeys))
        })
      }
    },
    {
      key: '_createUse',
      value: function _createUse(useKeys) {
        var _this7 = this

        var use = {}
        useKeys.forEach(function(key) {
          return (use[key] = _this7._use[key])
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
