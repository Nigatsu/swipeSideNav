(function ()
{
    'use strict';

    var gulp = require('gulp');
    var connect = require('gulp-connect');
    var useref = require('gulp-useref');
    var less = require('gulp-less');
    var deploy = require('gulp-gh-pages');
    var del = require('del');

    gulp.task('webserver', function ()
    {
        return connect.server({
            root: ['app', '.tmp'],
            port: 9000,
            livereload: true
        });
    });

    gulp.task('clean:dist', function() {
        return del.sync(['dist','.publish']);
    });

    gulp.task('useref', function ()
    {
        return gulp.src('app/**/*.html')
                .pipe(useref())
                .pipe(gulp.dest('dist'));
    });

    gulp.task('deploy', function ()
    {
        return gulp.src('./dist/**/*')
                .pipe(deploy());
    });

    gulp.task('html', function ()
    {
        return gulp.src('./app/**/*.html')
                .pipe(connect.reload());
    });

    gulp.task('less', function ()
    {
        return gulp.src('./app/styles/main.less')
                .pipe(less())
                .pipe(gulp.dest('app/styles'))
                .pipe(connect.reload());
    });

    gulp.task('js', function ()
    {
        return gulp.src('./app/**/*.js')
                .pipe(connect.reload());
    });

    gulp.task('watch', function ()
    {
        gulp.watch('app/**/*.less', ['less']);
        gulp.watch('app/**/*.html', ['html']);
        gulp.watch('app/**/*.js', ['js']);
    });

    gulp.task('default', ['less', 'webserver', 'watch']);
    gulp.task('dist', ['clean:dist', 'useref']);

})();
