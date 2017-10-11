"use strict";

var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var uncss = require('gulp-uncss');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');  // concatJS
var sass = require('gulp-sass');
var browserSync = require('browser-sync'); // Подключаем Browser Sync

gulp.task('sass', function() {
    return gulp.src(['sass/**/*.sass', 'sass/**/*.scss'])
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: '/'
        },
        notify: false
    });
});

// Build
gulp.task('concat', function () {
    // CSS
    gulp.src(['vendors/*.css','css/clp.css', 'css/media/clp-media.css'])
        .pipe(concatCss('*.css', { rebaseUrls: false }))
        .pipe( autoprefixer( ['last 15 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'], {cascade: true} ) )
        .pipe(rename('main.css'))
        .pipe(minifyCSS())
        // .pipe(uncss({
        //     html: ['index.html']
        // }))
        .pipe(gulp.dest('css/'))
        .pipe(notify('Done!'));

    // JS
    gulp.src(['vendors/jquery-3.1.1.min.js', 'vendors/slick.min.js', 'js/clp.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('js/'))
        .pipe(notify('Done!'));
});

gulp.task('watch', ['browser-sync', 'sass'],function() {
    gulp.watch(['**/*.sass', '**/*.scss'], ['sass']);
    gulp.watch('**/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
});

gulp.task('default', ['watch', 'concat']);
