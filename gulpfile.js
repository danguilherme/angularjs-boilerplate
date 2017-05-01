var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-csso');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var gulpsync = require('gulp-sync')(gulp);
var webserver = require('gulp-webserver');

var paths = {
  sass: './assets/scss/**/*.scss',
  vendorScripts: [
    './assets/vendor/angular/angular.min.js',
    './assets/vendor/angular-route/angular-route.min.js',
    './assets/vendor/angular-bootstrap/ui-bootstrap.min.js',
    './assets/vendor/moment/min/moment.min.js'
  ]
}

var build = {
  root: 'build/',
  assets: './build/assets',
  css: './build/assets/css'
}

gulp.task('build:sass', function () {
  return gulp.src('./assets/scss/app.scss')
    .pipe(plumber(function (err) {
      console.error('ERROR', err.message);
      this.emit('end');
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest(build.css));
});

gulp.task('build:concat:vendor', function () {
  return gulp.src(paths.vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(build.root));
});

gulp.task('build:concat', ['build:concat:vendor'], function () {
  return gulp.src(['./app/app.js', 'app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(build.root));
});

gulp.task('build:assets:vendor', function () {
  return gulp
    .src(['./assets/vendor/{components-font-awesome,another}/**/*'])
    .pipe(gulp.dest(build.assets + '/vendor'));
});

gulp.task('build:assets', ['build:assets:vendor'], function () {
  return gulp
    .src(['./assets/{fonts,imgs}/**/*'])
    .pipe(gulp.dest(build.assets));
});

gulp.task('build', gulpsync.sync(['build:assets', 'build:concat', 'build:sass']));

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
    'assets/vendor/**',
    // need to negate the whole path because of a bug: https://github.com/sindresorhus/del/issues/3
    '!assets/vendor',
    '!assets/vendor/bootstrap',
    '!assets/vendor/bootstrap/scss',
    '!assets/vendor/bootstrap/scss/_custom.scss'
  ], { dot: true });
});

gulp.task('clean', ['clean:install', 'clean:build']);

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
  gulp.watch('./assets/scss/*.scss', ['build']);
  gulp.watch('./app/**/*', ['build']);
});

gulp.task('default', ['watch']);