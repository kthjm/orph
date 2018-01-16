// @flow
const USE_KEYS = ['props', 'state', 'render', 'update', 'dispatch']

const isArr = Array.isArray
const isFnc = (data: any): boolean => typeof data === 'function'
const isReturn = (data: any): boolean =>
  typeof data !== 'object' || data === null

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

const throwing = (condition: boolean, message: string): void => {
  if (condition) {
    throw new Error(message)
  }
}

export default class Orph {
  _initialState: any
  _orphans: Map<Name, OrphanObject>
  _use: Use
  _escapeState: () => any

  constructor(initialState: any): void {
    this._initialState = cloneByRecursive(initialState)
    this._orphans = new Map()
    this._use = {}
  }

  register(actions: Actions, options: Add$Options) {
    const use = options.use || {}
    const useKeys = Object.keys(use).filter(
      key => USE_KEYS.includes(key) && use[key]
    )

    // set orphans
    const { prefix } = options
    Object.entries(actions).forEach(
      ([name, orphan]) =>
        typeof orphan === 'function' &&
        this._orphans.set(`${prefix || ''}${name}`, { orphan, useKeys })
    )
  }

  order(names: Array<Name> = []): Orphans$Created {
    const orphans = {}
    names.forEach(name => {
      orphans[name] = e => this.dispatch(name, e)
    })
    return orphans
  }

  dispatch(name: Name, data: Data): Dispatch$Result {
    throwing(!this._orphans.has(name), `${name} is not added`)

    if (data && isFnc(data.persist)) data.persist()

    const orphanObject: any = this._orphans.get(name)
    ;(orphanObject: OrphanObject)

    const { orphan, useKeys } = orphanObject
    const use = this._createUse(useKeys)
    return Promise.resolve(orphan(data, use))
  }

  _createUse(useKeys: UseKeys) {
    const use = {}
    useKeys.forEach(key => {
      use[key] = this._use[key]
    })
    return use
  }

  attach(r: React): void {
    throwing(!isFnc(r.setState), `orph.attach must be passed react`)

    this._use.props = (name, reference) =>
      reference ? r.props[name] : cloneByRecursive(r.props[name])
    this._use.state = (name, reference) =>
      reference ? r.state[name] : cloneByRecursive(r.state[name])
    this._use.render = (partialState, callback) =>
      r.setState(partialState, callback)
    this._use.update = callback => r.forceUpdate(callback)
    this._use.dispatch = (name, data) => this.dispatch(name, data)

    r.state = this._initialState
    this._escapeState = () => r.state
  }

  detach(save: boolean): void {
    this._initialState = save ? this._escapeState() : this._initialState
    Object.keys(this._use).forEach(key => delete this._use[key])
    delete this._escapeState
  }

  list(): { [key: Name]: UseKeys } {
    const list = {}
    ;[...this._orphans.entries()].forEach(([name, { useKeys }]) => {
      list[name] = useKeys
    })
    return list
  }
}

type Name = string
type Orphan$Result = any
type Orphan = (data: Data, methods: Use) => Orphan$Result
type Use = {
  props?: PropsFn,
  state?: StateFn,
  render?: SetState,
  update?: ForceUpdate,
  dispatch?: Dispatch
}

type Actions = { [name: Name]: Orphan }
type Add$Options = {
  prefix?: string,
  use: {
    props?: boolean,
    state?: boolean,
    render?: boolean,
    update?: boolean,
    dispatch?: boolean
  }
}

type Dispatch = (name: Name, data: Data) => Dispatch$Result
type UseKeys = Array<string>

type Orphans$Created = {
  [name: Name]: (e: Data) => Dispatch$Result
}

type OrphanObject = {
  orphan: Orphan,
  useKeys: UseKeys
}

type Dispatch$Result = Promise<Orphan$Result>
type Data = any
type StateFn = () => State
type PropsFn = () => Props
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
