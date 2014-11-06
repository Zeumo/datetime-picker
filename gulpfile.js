var _        = require('lodash'),
  pkg        = require('./package.json'),
  gulp       = require('gulp'),
  declare    = require('gulp-declare'),
  concat     = require('gulp-concat'),
  wrap       = require('gulp-wrap'),
  sass       = require('gulp-sass'),
  handlebars = require('gulp-handlebars'),
  webserver  = require('gulp-webserver');

gulp.task('default', ['build', 'sass', 'watch', 'server']);

gulp.task('watch', function() {
  gulp.watch(['src/*', 'package.json'], ['build']);
  gulp.watch('example/*.scss', ['sass']);
});

gulp.task('sass', function() {
  gulp.src('example/*.scss')
    .pipe(sass({
      includePaths: ['bower_components']
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('templates', function(){
  return gulp.src('src/*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'JST',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['templates'], function() {
  gulp.src([
    'src/picker.js',
    'src/events.js',
    'src/display.js',
    'src/helpers.js',
    'src/calendar.js',
    'src/plugin.js',
    '.tmp/templates.js'
  ])
  .pipe(concat('datepicker.js'))
  .pipe(wrap({
    src: 'src/wrapper.js',
  },
  {
    version: pkg.version
  }))
  .pipe(gulp.dest('dist/'));
});

gulp.task('server', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});
