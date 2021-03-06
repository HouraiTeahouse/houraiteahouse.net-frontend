// Environment Variables
const PRODUCTION_MODE = (process.env.NODE_ENV === 'production');
const DEVELOPMENT_MODE = !PRODUCTION_MODE;

// Imports
let stylelint = require('stylelint');

// PostCSS Input and Output Path
const INPUT_PATH = 'src/main.css';
const OUTPUT_PATH = 'dist/main.css';

// Target Browsers
const TARGET_BROWSERS = [
    'IE 9',
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Edge versions',
    'last 2 Safari versions',
    'last 2 Android versions',
    'last 2 ChromeAndroid versions',
    'last 2 iOS versions',
    'last 2 ExplorerMobile versions'
];

// PostCSS Base Config
const POSTCSS_CONFIG = {
    input: INPUT_PATH,

    output: OUTPUT_PATH,

    use: ['stylelint', 'postcss-import', 'postcss-cssnext', 'postcss-reporter'],

    "postcss-import": {
        plugins: [stylelint]
    },

    "cssnext": {
        browsers: TARGET_BROWSERS
    }
};

// Customize PostCSS Config
if (DEVELOPMENT_MODE) {
    POSTCSS_CONFIG.map = { inline: false };
}

if (PRODUCTION_MODE) {
    POSTCSS_CONFIG.map = false;

    POSTCSS_CONFIG.use.push('cssnano');
    POSTCSS_CONFIG["cssnano"] = {
        browsers: TARGET_BROWSERS
    };
}

// Export PostCSS Config
module.exports = POSTCSS_CONFIG;
