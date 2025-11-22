const cssnano = require('cssnano');

module.exports = {
    plugins: [
        require('postcss-import'),
        require('precss'),
        require('tailwindcss'),
        require('postcss-hexrgba'),
        require('postcss-color-function'),
        require('autoprefixer'),
        ...process.env.NODE_ENV === 'production'
            ? [cssnano] : []
    ]
};
