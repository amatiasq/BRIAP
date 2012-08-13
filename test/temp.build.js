/*
 * This is an example build file that demonstrates how to use the build system for
 * require.js.
 *
 * THIS BUILD FILE WILL NOT WORK. It is referencing paths that probably
 * do not exist on your machine. Just use it as a guide.
 *
 *
 */

({
    baseUrl: '../src',

    paths: {
        'Underscore': '../lib/underscore-require',
        'mocha_adapter': '../lib/test/mocha_adapter',
        'expect': '../lib/test/expect',
        'expect-sinon': '../lib/test/expectSinon',
        'sinon': '../lib/test/sinon-1.3.4',
        'mocha': '../lib/test/mocha',
        'test': '../test'
    },

    shim: {
        'mocha': {
            deps: [ 'expect', 'sinon', 'mocha_adapter' ]
        },
        'sinon': {
            deps: [ 'expect-sinon' ]
        },
        'expect-sinon': {
            deps: [ 'expect' ]
        }
    },

    //How to optimize all the JS files in the build output directory.
    //Right now only the following values
    //are supported:
    //- "uglify": (default) uses UglifyJS to minify the code.
    //- "closure": uses Google's Closure Compiler in simple optimization
    //mode to minify the code. Only available if running the optimizer using
    //Java.
    //- "closure.keepLines": Same as closure option, but keeps line returns
    //in the minified files.
    //- "none": no minification will be done.
    optimize: "none",

    //Inlines the text for any text! dependencies, to avoid the separate
    //async XMLHttpRequest calls to load those dependencies.
    inlineText: true,

    //Allow "use strict"; be included in the RequireJS files.
    //Default is false because there are not many browsers that can properly
    //process and give errors on code for ES5 strict mode,
    //and there is a lot of legacy code that will not work in strict mode.
////    useStrict: true,

    //Allows trimming of code branches that use has.js-based feature detection:
    //https://github.com/phiggins42/has.js
    //The code branch trimming only happens if minification with UglifyJS or
    //Closure Compiler is done. For more information, see:
    //http://requirejs.org/docs/optimization.html#hasjs
    has: {
        'function-bind': true,
        'string-trim': false
    },

    //If you only intend to optimize a module (and its dependencies), with
    //a single file as the output, you can specify the module options inline,
    //instead of using the 'modules' section above. 'exclude',
    //'excludeShallow', 'include' and 'insertRequire' are all allowed as siblings
    //to name. The name of the optimized file is specified by 'out'.
    name: "test/main",
    out: "build.js",

    //Another way to use wrap, but uses default wrapping of:
    //(function() { + content + }());
    wrap: true
})
