// Karma configuration
// Generated on Sat Jun 03 2017 19:29:14 GMT+0900 (東京 (標準時))

module.exports = function(config) {
    config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'mocha',
            // "mocha-webworker"
        ],


    // list of files / patterns to load in the browser
        // files: [
        //     'src/*.*',
        //     'test/*.js'
        // ],
        files: [
            // 'node_modules/babel-polyfill/dist/polyfill.js',
            // 'test/*.js'
            'test/main.js'
        ],


    // list of files to exclude
        exclude: [
        ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "test/main.js": [
                "webpack",
                "sourcemap"
            ]
        },

        webpack: {
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: [require("path").resolve(__dirname,"node_modules")],
                        use: [
                            {
                                loader: `babel-loader`,
                                options: {
                                    cacheDirectory: true
                                }
                            }
                        ]
                    }
                ]
            },
            // resolve: {},
            externals: {
                'cheerio': 'window',
                'react/addons': 'react',
                'react/lib/ExecutionEnvironment': 'react',
                'react/lib/ReactContext': 'react'
            },
            devtool: "source-map"
        },

        // client: {
        //     // 3. Configure the URLs that this plugin should execute
        //     //    within a WebWorker for you. These patterns are
        //     //    matched (using minimatch) on the `config.files`
        //     //    array configured in step 2.
        //     //    If you omit `pattern`, all URLs will be executed.
        //     mochaWebWorker: {
        //         pattern : [
        //             // 'test/my-test-case.js',
        //             // 'test/more-test-cases/*.js'
        //         ],
        //         // You can also use a SharedWorker for test execution
        //         // instead of the default 'Worker'
        //         // worker: 'SharedWorker',
        //         // You can also pass some options to mocha:
        //         // mocha   : {
        //         //     ui: 'tdd'
        //         // },
        //         // You can also evaluate javascript code within the Worker at various stages:
        //         evaluate: {
        //             beforeMochaImport: 'self.console.log("Before the mocha script is imported")',
        //             beforeMochaSetup : 'self.console.log("Before mocha is setup (mocha.setup())")',
        //             beforeScripts    : 'self.console.log("Before your scripts are imported")',
        //             beforeRun        : 'self.console.log("Before your tests are run (mocha.run())")',
        //             afterRun         : 'self.console.log("After your tests have been run")'
        //         }
        //     }
        // },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


    // web server port
        port: 9876,


    // enable / disable colors in the output (reporters and logs)
        colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Chrome'],
        browsers: [
            `Chrome`,
            // "ChromeHeadless",
            // "ChromeCanaryHeadless",
            'PhantomJS',
            'PhantomJS_custom'
        ],

        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    },
                },
                flags: ['--load-images=true'],
                debug: true
            }
        },

        phantomjsLauncher: {
          // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },



    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
