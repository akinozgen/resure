const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.config.hmrOptions.host = 'resure.space';
mix.notifications.onSuccess = false;

if ( ! mix.inProduction()) {
  mix.webpackConfig({
    devtool: 'inline-source-map'
  })
}

mix.react('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css');
