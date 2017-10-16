var gulp           = require('gulp'),
        gutil          = require('gulp-util' ),
        sass           = require('gulp-sass'),
        browserSync    = require('browser-sync'),
        concat         = require('gulp-concat'),
        uglify         = require('gulp-uglify'),
        cleanCSS       = require('gulp-clean-css'),
        rename         = require('gulp-rename'),
        del            = require('del'),
        imagemin       = require('gulp-imagemin'),
        cache          = require('gulp-cache'),
        autoprefixer   = require('gulp-autoprefixer'),
        bourbon        = require('node-bourbon'),
        ftp            = require('vinyl-ftp'),
        notify         = require("gulp-notify");



gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});
// Скрипты проекта
gulp.task('scripts', function() {
    return gulp.src([
        './app/libs/jquery/jquery.min.js',
        './app/libs/bootstrap-sass-3.3.7/assets/javascripts/bootstrap.min.js',
        './app/js/script.js' // Всегда в конце
        ])
    .pipe(concat('scripts.min.js'))
//  .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('sass', function() {
   return gulp.src('app/sass/**/*')//.sass
    .pipe(sass({
        includePaths: bourbon.includePaths
    }).on("error", notify.onError()))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer(['last 20 versions']))
    //.pipe(cleanCSS())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
    gulp.watch('app/sass/**/*', ['sass', browserSync.reload]);
    gulp.watch('app/js/*.js', ['scripts', browserSync.reload]);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

    var buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess'
        ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/*.css',
        ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/*.js'
        ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*']
        ).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

    var conn = ftp.create({
        host:      'semdev.ftp.ukraine.com.ua',
        user:      'semdev_rsmolivok',
        password:  'pp0y44g8',
        parallel:  10,
        log: gutil.log
    });

    var globs = [
    'dist/**',
    'dist/.htaccess'
    ];
    return gulp.src(globs, {buffer: false})
    .pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);



