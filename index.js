// @flow
type Name = string
type Data = any
type Action = (
  data: Data,
  use: {
    props?: CancelableFn<Props>,
    state?: CancelableFn<State>,
    render?: CancelableFn<void>,
    update?: CancelableFn<void>,
    dispatch?: Dispatch
  }
) => Action$Result
type Action$Result = any
type Dispatch = (name: Name, data: Data) => Dispatch$Result
type Dispatch$Result = Promise<Action$Result>
type UseKeys = Array<string>
type ActionObject = { action: Action, useKeys: UseKeys }

type Listener = (e: SyntheticEvent<EventTarget>) => void
type Listeners = { [name: Name]: Listener }

type PropsValue = any
type StateValue = any
type Props = { [key: any]: PropsValue }
type State = { [key: any]: StateValue }
type React = React$Component<Props, State>

type CancelableFn<R> = (...arg: any) => CancelableFn$Result<R>
type CancelableFn$Result<R> = Promise<R | Canceled>
type Canceled = { isDetached: true }

const REACT_KEYS = ['props', 'state', 'render', 'update']
const USABLE_KEYS = REACT_KEYS.concat(['dispatch'])

const isReturn = (data: any): %checks => typeof data !== 'object' || data === null
const isArr = Array.isArray
const cloneByRecursive = (data: any): any =>
  isReturn(data)
    ? data
    : isArr(data)
      ? data.map(content => cloneByRecursive(content))
      : (obj => {
          Object.keys(data).forEach(key => {
            obj[key] = cloneByRecursive(data[key])
          })
          return obj
        })({})

const isObj = (data: any): %checks => typeof data === 'object' && !isArr(data) && data !== null
const isFnc = (data: any): %checks => typeof data === 'function'

const asserts = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export default class Orph {
  _actions: Map<Name, ActionObject>
  _initialState: State
  _preState: State
  _escapeState: () => State
  _use: {
    dispatch: Dispatch,
    props?: CancelableFn<Props>,
    state?: CancelableFn<State>,
    render?: CancelableFn<void>,
    update?: CancelableFn<void>
  }

  constructor(initialState: any): void {
    asserts(
      isObj(initialState),
      'Orph.prototype.constructor requires argument as "object" not others'
    )

    this._actions = new Map()
    this._initialState = cloneByRecursive(initialState)
    this._use = { dispatch: (name, data) => this.dispatch(name, data) }
  }

  register(
    actions: { [name: Name]: Action },
    options: {
      prefix?: string,
      use: {
        props?: boolean,
        state?: boolean,
        render?: boolean,
        update?: boolean,
        dispatch?: boolean
      }
    }
  ) {
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

    const prefix = options.prefix || ''
    const useKeys = USABLE_KEYS.filter(key => options.use[key] === true)
    Object.entries(actions).forEach(
      ([name, action]) =>
        isFnc(action) &&
        this._actions.set(`${prefix}${name}`, { useKeys, action })
    )
  }

  order(names?: Array<Name>): Listeners {
    asserts(
      !names || isArr(names),
      'Orph.prototype.order requires argument as "array"'
    )

    const listeners: Listeners = {}
    const orderNames: any = names || [...this._actions.keys()]
    ;(orderNames: Array<Name>)

    orderNames.forEach(name => {
      listeners[name] = e => {
        if (isObj(e) && isFnc(e.persist)) e.persist()
        this.dispatch(name, e)
      }
    })

    return listeners
  }

  list(): { [key: Name]: UseKeys } {
    const list = {}
    ;[...this._actions.entries()].forEach(([name, { useKeys }]) => {
      list[name] = useKeys
    })
    return list
  }

  attach(r: React, options: { inherit?: boolean } = {}): void {
    asserts(isFnc(r.setState), `orph.attach must be passed react`)

    this._escapeState = () => r.state

    this._use.props = this._makeUseCancelable(
      (name: string, reference?: boolean): Props =>
        reference ? r.props[name] : cloneByRecursive(r.props[name])
    )

    this._use.state = this._makeUseCancelable(
      (name: string, reference?: boolean): State =>
        reference ? r.state[name] : cloneByRecursive(r.state[name])
    )

    this._use.render = this._makeUseCancelable(
      (
        partialState: $Shape<State> | ((State, Props) => $Shape<State> | void),
        callback?: () => mixed
      ): void => r.setState(partialState, callback)
    )

    this._use.update = this._makeUseCancelable((callback?: () => void): void =>
      r.forceUpdate(callback)
    )

    r.state = options.inherit ? this._existState() : this._initialState
  }

  _makeUseCancelable<R>(fn: (...arg: *) => R): CancelableFn<R> {
    return (...arg) =>
      new Promise(
        (resolve, reject) =>
          this._isAttached()
            ? resolve(fn(...arg))
            : reject({ isDetached: true })
      )
  }

  detach(): void {
    this._preState = this._escapeState()
    delete this._escapeState
    REACT_KEYS.forEach(key => delete this._use[key])
  }

  _existState() {
    return this._preState || this._initialState
  }

  _isAttached(): boolean {
    return isFnc(this._escapeState)
  }

  dispatch(name: Name, data: Data): Dispatch$Result {
    asserts(
      this._actions.has(name),
      `Orph.prototype.dispatch passed ${name} as name that is not retisterd`
    )

    const actionObject: any = this._actions.get(name)
    ;(actionObject: ActionObject)

    return Promise.resolve(
      actionObject.action(data, this._createUse(actionObject.useKeys))
    )
  }

  _createUse(useKeys: UseKeys) {
    const use = {}
    useKeys.forEach(key => {
      use[key] = this._use[key]
    })
    return use
  }

  getLatestState(key: string, reference?: boolean): StateValue {
    const referenceValue = this._isAttached()
      ? this._escapeState()[key]
      : this._existState()[key]

    return reference ? referenceValue : cloneByRecursive(referenceValue)
  }
}
