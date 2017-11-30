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
var isArray = Array.isArray
var assign = Object.assign

var Orph = (function() {
  function Orph(listeners) {
    var _this = this

    classCallCheck(this, Orph)

    this.active = false
    this._listeners = new Map()

    if (isArray(listeners)) {
      listeners.forEach(function(tuple) {
        return _this.add.apply(_this, toConsumableArray(tuple))
      })
    }
  }

  createClass(Orph, [
    {
      key: 'add',
      value: function add(name, listener, opts) {
        throwIf(name, 'string', 'orph.add argument "name"')
        throwIf(listener, 'function', 'orph.add argument "listener"')
        opts = opts || {}
        var render = this._HoRender(opts.states)
        var dispatch = this._HoDispatch(opts.dispatches)
        this._listeners.set(name, {
          listener: listener,
          render: render,
          dispatch: dispatch,
          states: opts.states,
          dispatches: opts.dispatches
        })
      }
    },
    {
      key: 'list',
      value: function list() {
        var list = {}
        var entries = [].concat(toConsumableArray(this._listeners.entries()))
        entries.forEach(function(_ref) {
          var _ref2 = slicedToArray(_ref, 2),
            name = _ref2[0],
            value = _ref2[1]

          list[name] = {
            states: value.states,
            dispatches: value.dispatches
          }
        })
        return list
      }
    },
    {
      key: 'attach',
      value: function attach(react) {
        throwIf(react.setState, 'function', 'react.setState')
        this._setState = react.setState.bind(react)
        this.props = function() {
          return assign({}, react.props)
        }
        this.state = function() {
          return assign({}, react.state)
        }
        this.active = true
      }
    },
    {
      key: 'detach',
      value: function detach() {
        this.active = false
      }
    },
    {
      key: 'create',
      value: function create(name) {
        var _this2 = this

        throwIf(name, 'string', 'orph.create argument "name"')
        this._throwIfNotActive('create')
        return function(e) {
          _this2._exec(name, e)
        }
      }
    },
    {
      key: 'dispatch',
      value: function dispatch(name, first) {
        throwIf(name, 'string', 'orph.dispatch argument "name"')
        this._throwIfNotActive('dispatch')
        return this._exec(name, first)
      }
    },
    {
      key: '_HoDispatch',
      value: function _HoDispatch(dispatches) {
        var _this3 = this

        return !isArray(dispatches)
          ? function(name, first) {
              return _this3._exec(name, first)
            }
          : function(name, first) {
              if (!(dispatches.indexOf(name) !== -1)) {
                throw new Error(
                  'methods.dispatch touches dispatchName that is not registerd'
                )
              }

              return _this3._exec(name, first)
            }
      }
    },
    {
      key: '_exec',
      value: function _exec(name, first) {
        var _this4 = this

        if (first && typeof first.persist === 'function') {
          first.persist()
        }

        return Promise.resolve().then(function() {
          _this4._throwIfNotActive('_exec')

          var listenerObject = _this4._listeners.get(name)

          if (!listenerObject) {
            throw new Error('methods.dispatch name is not added')
          } else {
            var listener = listenerObject.listener,
              render = listenerObject.render,
              dispatch = listenerObject.dispatch
            var state = _this4.state,
              props = _this4.props

            return listener(first, {
              render: render,
              dispatch: dispatch,
              state: state,
              props: props
            })
          }
        })
      }
    },
    {
      key: '_HoRender',
      value: function _HoRender(states) {
        var _this5 = this

        return !isArray(states)
          ? function(nextState) {
              return _this5._render(nextState)
            }
          : function(nextState) {
              if (
                (typeof nextState === 'undefined'
                  ? 'undefined'
                  : _typeof(nextState)) === 'object'
              ) {
                var leaks = Object.keys(nextState).filter(function(name) {
                  return !(states.indexOf(name) !== -1)
                })
                if (leaks.length) {
                  throw new Error(
                    'methods.render touches stateName that is not registerd'
                  )
                }
              }

              return _this5._render(nextState)
            }
      }
    },
    {
      key: '_render',
      value: function _render(nextState) {
        if (!this.active) return

        var preState = this.state()
        this._setState(assign(preState, nextState))
      }
    },
    {
      key: '_throwIfNotActive',
      value: function _throwIfNotActive(fnName) {
        if (!this.active) {
          throw new Error('not active but ' + fnName + '()')
        }
      }
    }
  ])
  return Orph
})()

var throwIf = function throwIf(target, type, key) {
  if (!target) {
    throw new Error(key + ' is undefined | false | null')
  }
  if (
    (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== type
  ) {
    throw new TypeError(
      key +
        ' is not ' +
        type +
        ' but ' +
        (typeof target === 'undefined' ? 'undefined' : _typeof(target))
    )
  }
}

module.exports = Orph
