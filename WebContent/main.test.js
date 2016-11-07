// Import polyfills (same as in standard webpack build)
import 'core-js/es6';
import 'babel-regenerator-runtime/runtime';

// Import core Angular and Angular mocks
import 'angular';
import 'angular-mocks';

// Import all spec files from this directory and all subdirectories.
let testsContext = require.context('.', true, /\.spec.js$/);
testsContext.keys().forEach((path) => {
    try { testsContext(path); }
    catch (err) {
        console.error('[ERROR] WITH SPEC FILE:', path);
        console.error(err);
    }
});