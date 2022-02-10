/// <binding BeforeBuild='deploy' ProjectOpened='watch' />
'use strict';

// REFERENCES
const fs = require('fs'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssmin = require('gulp-cssmin'),
	gulpif = require('gulp-if'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('autoprefixer'),
	postcss = require('gulp-postcss'),
	notify = require('gulp-notify'),
	webpack = require('webpack-stream'),
	purgecss = require('gulp-purgecss'),
	TerserPlugin = require('terser-webpack-plugin');

let paths;

const config = {
	environment: process.env['Gulp:Environment'],
};

// Purge Safelist
const purge = {
	safelist: ['modal-open', 'modal-static', 'modal-backdrop', 'fade', 'show', 'collapsing'],
	blocklist: [],
};

// FORK
paths = {
	// INPUTS
	theme_js_in: 'src/main/resources/static/_src/js/**/*.js',
	theme_css_main: 'src/main/resources/static/_src/scss/main.scss',
	theme_css_in: [
		'src/main/resources/static/_src/scss/**/*.scss',
		'src/main/resources/static/_src/js/**/*.js',
		'src/main/resources/templates/**/*.html',
	],

	// OUTPUTS
	theme_js_out: 'src/main/resources/static/_dst/js',
	theme_css_out: 'src/main/resources/static/_dst/css',

	theme_css_watch: [
		'src/main/resources/static/_src/scss/{ui,modules}/*.scss',
		'src/main/resources/static/_src/js/**/*.js',
		'src/main/resources/templates/**/*.html',
	],
};

// THEME STYLES
gulp.task('styles', (done) => {
	return gulp
		.src(paths.theme_css_main)
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'Gulp error in ' + err.plugin,
						message: err.toString(),
					})(err);
					done();
				},
			})
		)
		.pipe(sass())
		.pipe(
			purgecss({
				content: paths.theme_css_watch,
				safelist: {
					standard: purge.safelist,
				},
				blocklist: purge.blocklist,
			})
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(gulpif(config.environment !== 'DEBUG', cssmin()))
		.pipe(gulp.dest(paths.theme_css_out));
});

// THEME SCRIPTS
gulp.task('scripts', (done) => {
	return gulp
		.src(paths.theme_js_in)
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'Gulp error in ' + err.plugin,
						message: err.toString(),
					})(err);
					done();
				},
			})
		)
		.pipe(
			webpack({
				mode: config.environment !== 'DEBUG' ? 'production' : 'development',
				optimization: {
					usedExports: true,
					minimizer: [new TerserPlugin()],
				},
				entry: {
					http: './src/main/resources/static/_src/js/http.js',
					app: './src/main/resources/static/_src/js/app.js',
				},
				output: {
					filename: '[name].js',
				},
				devtool: 'source-map',
				resolve: {
					extensions: ['.js'],
				},
				module: {
					rules: [
						{
							test: /\.js$/,
							exclude: /node_modules/,
							use: [
								{
									loader: 'babel-loader',
									options: {
										presets: [
											[
												'@babel/preset-env',
												{
													modules: false,
													useBuiltIns: 'usage',
													corejs: 3,
													targets: '> 1%, not dead',
												},
											],
										],
									},
								},
							],
						},
					],
				},
			})
		)
		.pipe(gulp.dest(paths.theme_js_out));
});

// THEME WATCH
gulp.task('watch', () => {
	gulp.watch(paths.theme_css_in, gulp.series('styles'));
	gulp.watch(paths.theme_js_in, gulp.series('scripts'));
});

gulp.task('default', gulp.series('styles', 'scripts', 'watch'));
