const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const pump = require('pump');
const fs = require("fs");
const { join } = require("path");
const { exec, spawn } = require('child_process');



function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((file) => file.isDirectory() ? walk(join(dir, file.name)) : join(dir, file.name))
}


const basePath = process.cwd().replace('apps/nfc-public', 'dist/apps/nfc-public');

gulp.task('compress-js', function (cb) {
  pump([gulp.src([`${basePath}**/*.js`]), uglify(), gulp.dest('dist')], cb);
});

gulp.task('minify-css', () => {


  return gulp
    .src([`${basePath}**/*.css`])
    .pipe(cleanCSS({ compatibility: 'ie10' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('compress-js', 'minify-css'));
