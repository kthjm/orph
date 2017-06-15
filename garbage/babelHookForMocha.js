require("babel-register")({
    babelrc: false,
    presets: [
        "flow",
        "es2015"
    ],
    plugins: [
        "add-module-exports",
        "empower-assert",
        "espower",
        "rewire",
        "transform-runtime"
    ]
});
