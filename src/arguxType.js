// @flow

export type causebefore = {
    cause: string,
    nodes: Array<?node>
}

export type node = {
    condition: condition,
    stateKeys: Array<?string>,
    business: void
}

export type condition = {

    type: string,

    id?: string,
    className?: string,
    listenerName?: string,
    path?: string,

    gentle?: number,
    gentleTimer?: number | boolean,
    prevent?: (e: e, clone: any) => boolean,
    ww?: boolean
}
// name?: string,
// lifecycleName?: string,

export type e = {
    type: string,
    currentTarget: {
        id: string,
        hasAttribute: (name: string) => boolean,
        getAttribute: (name: string) => string
    },
    data: {
        listenerName: string,
        // message: void
    },
    reactLifeCycle: boolean
}

export interface CauseClass {

    // constructor: (node: node) => void,
    nodes: Array<NodeClass>,
    prevent: (e: e) => ?boolean

}

// export

export interface NodeClass {
    condition: condition,
    stateKeys: Array<?string>,
    business: void,
    prevent: (e: e, clone: any) => boolean,
    preventOfUnique: (e: e, condition: condition) => boolean
}

// export type causeSince = {
//     cause: string,
//     nodes: Array<?node>
// }


// export type causeClasses = {
//     dom: ,
//     window: ,
//
// }
