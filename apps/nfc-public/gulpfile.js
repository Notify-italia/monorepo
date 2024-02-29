const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const pump = require('pump');

gulp.task('compress-js', function (cb) {
  pump(
    [gulp.src(['dist/apps/nfc-public/**/*.js']), uglify(), gulp.dest('dist')],
    cb
  );
});

gulp.task('minify-css', () => {
  return gulp
    .src(['dist/apps/nfc-public/**/*.css'])
    .pipe(cleanCSS({ compatibility: 'ie10' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('compress-js', 'minify-css'));
