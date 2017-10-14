// @flow
const { isArray } = Array
const { assign } = Object

export default class Orph {
  _listeners: Map<Name, ListenerObject>
  active: boolean
  _setState: SetState
  props: PropsFn
  state: StateFn

  constructor(listeners: Listeners) {
    this.active = false
    this._listeners = new Map()

    if (isArray(listeners)) {
      listeners.forEach(tuple => this.add(...tuple))
    }
  }

  add(name: Name, listener: Listener, opts: ListenerOptions): void {
    throwIf(name, 'string', `orph.add argument "name"`)
    throwIf(listener, 'function', `orph.add argument "listener"`)
    opts = opts || {}
    const render = this._HoRender(opts.states)
    const dispatch = this._HoDispatch(opts.dispatches)
    this._listeners.set(name, {
      listener,
      render,
      dispatch,
      states: opts.states,
      dispatches: opts.dispatches
    })
  }

  list() {
    const list = {}
    const entries = [...this._listeners.entries()]
    entries.forEach(([name, value]) => {
      list[name] = {
        states: value.states,
        dispatches: value.dispatches
      }
    })
    return list
  }

  attach(react: React): void {
    throwIf(react.setState, 'function', `react.setState`)
    this._setState = react.setState.bind(react)
    this.props = () => assign({}, react.props)
    this.state = () => assign({}, react.state)
    this.active = true
  }

  detach(): void {
    this.active = false
  }

  create(name: Name): ListenerWrapper {
    throwIf(name, 'string', `orph.create argument "name"`)
    this._throwIfNotActive(`create`)
    return e => {
      this._exec(name, e)
    }
  }

  dispatch(name: Name, first: First): ExecResult {
    throwIf(name, 'string', `orph.dispatch argument "name"`)
    this._throwIfNotActive(`dispatch`)
    return this._exec(name, first)
  }

  _HoDispatch(dispatches: Dispatches): Dispatch {
    return !isArray(dispatches)
      ? (name, first) => this._exec(name, first)
      : (name, first) => {
          if (!dispatches.includes(name)) {
            throw new Error(
              `methods.dispatch touches dispatchName that is not registerd`
            )
          }

          return this._exec(name, first)
        }
  }

  _exec(name: Name, first: First): ExecResult {
    if (first && typeof first.persist === 'function') {
      first.persist()
    }

    return Promise.resolve().then(() => {
      this._throwIfNotActive(`_exec`)

      const listenerObject = this._listeners.get(name)

      if (!listenerObject) {
        throw new Error(`methods.dispatch name is not added`)
      } else {
        ;(listenerObject: ListenerObject)
        const { listener, render, dispatch } = listenerObject
        const { state, props } = this
        return listener(first, {
          render,
          dispatch,
          state,
          props
        })
      }
    })
  }

  _HoRender(states: States): Render {
    return !isArray(states)
      ? nextState => this._render(nextState)
      : nextState => {
          if (typeof nextState === 'object') {
            const leaks = Object.keys(nextState).filter(
              name => !states.includes(name)
            )
            if (leaks.length) {
              throw new Error(
                'methods.render touches stateName that is not registerd'
              )
            }
          }

          return this._render(nextState)
        }
  }

  _render(nextState: State): void {
    if (!this.active) return

    const preState = this.state()
    this._setState(assign(preState, nextState))
  }

  _throwIfNotActive(fnName: string): void {
    if (!this.active) {
      throw new Error(`not active but ${fnName}()`)
    }
  }
}

const throwIf = (target, type, key) => {
  if (!target) {
    throw new Error(`${key} is undefined | false | null`)
  }
  if (typeof target !== type) {
    throw new TypeError(`${key} is not ${type} but ${typeof target}`)
  }
}

type Listeners = Array<Add$Arg>
type Add$Arg = [Name, Listener, ListenerOptions]

type Name = string
type Listener = (first: First, methods: Methods) => void
type States = Array<string>
type Dispatches = Array<string>
type ListenerOptions = {
  states: States,
  dispatches: Dispatches
}

type Render = (nextState: State) => void
type Dispatch = (name: Name, first: First) => ExecResult
type ListenerObject = {
  listener: Listener,
  render: Render,
  dispatch: Dispatch,
  states: States | void,
  dispatches: Dispatches | void
}

type ExecResult = Promise<void>

type ListenerWrapper = (e: First) => void
type First = any
type StateFn = () => State
type PropsFn = () => Props
type Methods = {
  render: Render,
  dispatch: Dispatch,
  state: StateFn,
  props: PropsFn
}

type SetState = (nextState: State) => void
type State = any
type Props = any
type React = {
  state: State,
  props: Props,
  setState: SetState
}
