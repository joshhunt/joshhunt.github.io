var path       = require('path');

var gulp       = require('gulp'),
    express    = require('express'),
    gutil      = require('gulp-util'),
    less       = require('gulp-less'),
    clean      = require('gulp-clean'),
    livereload = require('gulp-livereload');

gulp.task('clean', function () {
    return gulp.src('build', {read: false}).pipe(clean());
});

gulp.task('styles', function () {
    return gulp.src('./less/*/style.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less') ]
        }))
        .pipe(gulp.dest('build/css'))
        .on('error', gutil.log)
        .pipe(livereload());
});

gulp.task('serve', function() {
    var server     = express(),
        serverport = 5000;
    server.use(express.static('./'));
    server.listen(serverport);
});

gulp.task('watch', function() {
    gulp.watch('./less/**/*.less', ['styles']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'watch', 'serve');
});