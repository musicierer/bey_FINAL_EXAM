var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch(['app/scss/**/*.scss','app/css/**/*.css'], ['sass']); 
  // Обновляем браузер при любых изменениях в HTML или JS
  gulp.watch('app/*.index.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
  })
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // кэширование изображений, прошедших через imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('allFiles', function() {
  return gulp.src('app/css/allStyle.css')
  .pipe(gulp.dest('dist/css'))
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts', 'allFiles'],
    callback
  )
})
