const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const gulpsync = require('gulp-sync')(gulp);
const webserver = require('gulp-webserver');

const paths = {
  sass: './assets/scss/**/*.scss',
  vendorScripts: [
    './assets/vendor/moment/min/moment.min.js',
    './assets/vendor/moment/locale/pt-br.js',
    './assets/vendor/angular/angular.min.js',
    './assets/vendor/angular-route/angular-route.min.js'
  ]
};

/**
 * Dependencies that should go with the build
 */
const dependenciesToCopy = ['components-font-awesome'];

const build = {
  root: './build/',
  jsFile: './build/app.js',
  assets: './build/assets',
  css: './build/assets/css'
};

gulp.task('build:css:minify', function () {
  return gulp.src(build.css + '/**/*')
    .pipe(minifyCSS())
    .pipe(gulp.dest(build.css));
});

gulp.task('build:css', function () {
  return gulp.src('./assets/scss/app.scss')
    .pipe(plumber(function (err) {
      console.error('ERROR', err.message);
      this.emit('end');
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(build.css));
});

gulp.task('build:js:concat:vendor', function () {
  return gulp.src(paths.vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(plumber(function (err) {
      console.error('ERROR', err.message);
      this.emit('end');
    }))
    .pipe(uglify())
    .pipe(gulp.dest(build.root));
});

gulp.task('build:js:concat', ['build:js:concat:vendor'], function () {
  return gulp.src(['./app/app.js', 'app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(build.root));
});

gulp.task('build:js:minify', () => {
  return gulp.src(build.jsFile)
    .pipe(plumber(function (err) {
      console.error('ERROR', err.message);
      this.emit('end');
    }))
    .pipe(uglify())
    .pipe(gulp.dest(build.root));
});

gulp.task('build:js', ['build:js:concat'], () => {
  return gulp.src(build.jsFile)
    .pipe(plumber(function (err) {
      console.error('ERROR', err.message);
      this.emit('end');
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(build.root));
});

gulp.task('build:assets:vendor', function () {
  return gulp
    .src([`./assets/vendor/{${dependenciesToCopy.join(',')}}/**/*`])
    .pipe(gulp.dest(build.assets + '/vendor'));
});

gulp.task('build:assets:misc', function () {
  return gulp
    .src(['./assets/*'])
    .pipe(gulp.dest(build.assets));
});

gulp.task('build:assets', ['build:assets:misc', 'build:assets:vendor'], function () {
  return gulp
    .src(['./assets/{fonts,imgs}/**/*'])
    .pipe(gulp.dest(build.assets));
});

// clean all build files
gulp.task('clean:build', function () {
  return del([
    'build'
  ]);
});

// clean all installed files (npm and bower)
gulp.task('clean:install', function () {
  return del([
    'node_modules/**',
    'assets/vendor/**'
  ], { dot: true });
});


gulp.task('serve', function () {
  gulp.src('./')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      host: '0.0.0.0',
      port: 3000,
      open: false
    }));
});

// Rerun the task when a file changes
gulp.task('watch', ['build', 'serve'], function () {
  gulp.watch('./assets/scss/**/*.scss', ['build']);
  gulp.watch('./app/**/*', ['build:js']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['build:assets', 'build:js', 'build:css']);
gulp.task('dist', gulpsync.sync(['build', 'build:js:minify', 'build:css:minify']));
gulp.task('clean', ['clean:install', 'clean:build']);