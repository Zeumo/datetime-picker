var _        = require('lodash'),
  pkg        = require('./package.json'),
  gulp       = require('gulp'),
  declare    = require('gulp-declare'),
  concat     = require('gulp-concat'),
  wrap       = require('gulp-wrap'),
  sass       = require('gulp-sass'),
  handlebars = require('gulp-handlebars');

gulp.task('default', ['build', 'sass']);

gulp.task('watch', function() {
  var reload = livereload();

  gulp.watch('src/*', ['build']);
  gulp.watch('example/*.scss', ['sass']);

  gulp.watch(['dist/*', 'example/*', '.tmp/*'])
    .on('change', function(file) {
      reload.changed(file.path);
    });
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
