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
var USE_KEYS = ['props', 'state', 'render', 'update', 'dispatch']

var isArr = Array.isArray
var isFnc = function isFnc(data) {
  return typeof data === 'function'
}
var isReturn = function isReturn(data) {
  return (
    (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ||
    data === null
  )
}

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

var throwing = function throwing(condition, message) {
  if (condition) {
    throw new Error(message)
  }
}

var Orph = (function() {
  function Orph(initialState) {
    classCallCheck(this, Orph)

    this._initialState = cloneByRecursive(initialState)
    this._orphans = new Map()
    this._use = {}
  }

  createClass(Orph, [
    {
      key: 'register',
      value: function register(actions, options) {
        var _this = this

        var use = options.use || {}
        var useKeys = Object.keys(use).filter(function(key) {
          return USE_KEYS.indexOf(key) !== -1 && use[key]
        })

        // set orphans
        var prefix = options.prefix

        Object.entries(actions).forEach(function(_ref) {
          var _ref2 = slicedToArray(_ref, 2),
            name = _ref2[0],
            orphan = _ref2[1]

          return (
            typeof orphan === 'function' &&
            _this._orphans.set('' + (prefix || '') + name, {
              orphan: orphan,
              useKeys: useKeys
            })
          )
        })
      }
    },
    {
      key: 'order',
      value: function order() {
        var _this2 = this

        var names =
          arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []

        var orphans = {}
        names.forEach(function(name) {
          orphans[name] = function(e) {
            return _this2.dispatch(name, e)
          }
        })
        return orphans
      }
    },
    {
      key: 'dispatch',
      value: function dispatch(name, data) {
        throwing(!this._orphans.has(name), name + ' is not added')

        if (data && isFnc(data.persist)) data.persist()

        var orphanObject = this._orphans.get(name)
        var orphan = orphanObject.orphan,
          useKeys = orphanObject.useKeys

        var use = this._createUse(useKeys)
        return Promise.resolve(orphan(data, use))
      }
    },
    {
      key: '_createUse',
      value: function _createUse(useKeys) {
        var _this3 = this

        var use = {}
        useKeys.forEach(function(key) {
          use[key] = _this3._use[key]
        })
        return use
      }
    },
    {
      key: 'attach',
      value: function attach(r) {
        var _this4 = this

        throwing(!isFnc(r.setState), 'orph.attach must be passed react')

        this._use.props = function(name, reference) {
          return reference ? r.props[name] : cloneByRecursive(r.props[name])
        }
        this._use.state = function(name, reference) {
          return reference ? r.state[name] : cloneByRecursive(r.state[name])
        }
        this._use.render = function(partialState, callback) {
          return r.setState(partialState, callback)
        }
        this._use.update = function(callback) {
          return r.forceUpdate(callback)
        }
        this._use.dispatch = function(name, data) {
          return _this4.dispatch(name, data)
        }

        r.state = this._initialState
        this._escapeState = function() {
          return r.state
        }
      }
    },
    {
      key: 'detach',
      value: function detach(save) {
        var _this5 = this

        this._initialState = save ? this._escapeState() : this._initialState
        Object.keys(this._use).forEach(function(key) {
          return delete _this5._use[key]
        })
        delete this._escapeState
      }
    },
    {
      key: 'list',
      value: function list() {
        var list = {}
        ;[]
          .concat(toConsumableArray(this._orphans.entries()))
          .forEach(function(_ref3) {
            var _ref4 = slicedToArray(_ref3, 2),
              name = _ref4[0],
              useKeys = _ref4[1].useKeys

            list[name] = useKeys
          })
        return list
      }
    }
  ])
  return Orph
})()

export default Orph
