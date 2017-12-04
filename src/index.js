// @flow
const { isArray } = Array
const { assign } = Object

export default class Orph {
  _listeners: Map<Name, ListenerObject>
  _reacts: Orph$Reacts | null

  constructor(listeners: Listeners): false | void {
    this._listeners = new Map()
    return isArray(listeners) && listeners.forEach(tuple => this.add(...tuple))
  }

  add(name: Name, listener: Listener, opts: ListenerOptions): void {
    throwIf(name, 'string', `orph.add argument "name"`)
    throwIf(listener, 'function', `orph.add argument "listener"`)
    const { states, dispatches } = opts || {}
    const render = this._HoRender(states)
    const dispatch = this._HoDispatch(dispatches)
    this._listeners.set(name, {
      listener,
      render,
      dispatch,
      list: { states, dispatches }
    })
  }

  attach(r: React): void {
    throwIf(r.setState, 'function', `react.setState`)
    throwIf(r.forceUpdate, 'function', `react.forceUpdate`)

    this._reacts = {
      setState: (partialState, callback) => r.setState(partialState, callback),
      update: callback => r.forceUpdate(callback),
      props: () => assign({}, r.props),
      state: () => assign({}, r.state)
    }
  }

  detach(): void {
    this._reacts = null
  }

  active(): boolean {
    return Boolean(this._reacts)
  }

  create(name: Name): ListenerWrapper {
    throwIf(name, 'string', `orph.create argument "name"`)
    this._throwIfNotActive(`create`)
    return e => this._exec(name, e)
  }

  dispatch(name: Name, first: First): ExecResult {
    throwIf(name, 'string', `orph.dispatch argument "name"`)
    this._throwIfNotActive(`dispatch`)
    return this._exec(name, first)
  }

  _HoRender(states: States): Render {
    return !isArray(states)
      ? (partialState, callback) =>
          this._reacts && this._reacts.setState(partialState, callback)
      : (partialState, callback) => {
          if (typeof partialState === 'object') {
            const leaks = Object.keys(partialState).filter(
              name => !states.includes(name)
            )
            if (leaks.length) {
              throw new Error(
                'methods.render touches stateName that is not registerd'
              )
            }
          }

          return this._reacts && this._reacts.setState(partialState, callback)
        }
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

    return Promise.resolve()
      .then(() => this._throwIfNotActive(`_exec`))
      .then(() => {
        const listenerObject = this._listeners.get(name)

        if (!listenerObject) {
          throw new Error(`methods.dispatch name is not added`)
        }
        ;(listenerObject: ListenerObject)

        const { listener, render, dispatch } = listenerObject
        const { state, props, update } = this._reacts || {}
        return listener(first, {
          render,
          dispatch,
          state,
          props,
          update
        })
      })
  }

  _throwIfNotActive(fnName: string): void {
    if (!this.active()) {
      throw new Error(`not active but ${fnName}()`)
    }
  }

  list() {
    const list = {}
    const entries = [...this._listeners.entries()]
    entries.forEach(([name, listenerObject]) => {
      list[name] = listenerObject.list
    })
    return list
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

type Orph$Reacts = {
  setState: SetState,
  update: ForceUpdate,
  props: PropsFn,
  state: StateFn
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

type Render = (partialState: State, callback: Render$Callback) => mixed
type Dispatch = (name: Name, first: First) => ExecResult
type ListenerObject = {
  listener: Listener,
  render: Render,
  dispatch: Dispatch,
  list: {
    states: States | void,
    dispatches: Dispatches | void
  }
}

type ExecResult = Promise<*>

type ListenerWrapper = (e: First) => ExecResult
type First = any
type StateFn = () => State
type PropsFn = () => Props
type Methods = {
  render: Render,
  dispatch: Dispatch,
  state: StateFn,
  props: PropsFn,
  update: ForceUpdate
}

type Render$Callback = () => mixed
type SetState = (partialState: State, callback: Render$Callback) => void
type ForceUpdate = (callback: Render$Callback) => void
type State = any
type Props = any
type React = {
  state: State,
  props: Props,
  setState: SetState,
  forceUpdate: ForceUpdate
}
