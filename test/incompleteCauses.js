export default [
    {cause: "window",nodes: [
        {
            condition: {
                type: "resize"
            },
            stateKeys: ["a"]
        }
    ]},
    {cause: "dom",nodes: [
        {
            condition: {
                type: "click",
                id: "theDiv"
            },
            stateKeys: ["b"]
        }
    ]},
    {cause: "path",nodes: [
        {
            condition: {
                type: "popstate",
                path: "/"
            },
            stateKeys: ["a","b"]
        }
    ]},
    {cause: "react",nodes: [
        {
            condition: {
                type: "didupdate",
                listenerName: "testDidUpdate"
            },
            stateKeys: []
        }
    ]},
    {cause: "worker",nodes: [
        {
            condition: {
                type: "message",
                listenerName: "testWorker"
            },
            stateKeys: []
        }
    ]}
]
