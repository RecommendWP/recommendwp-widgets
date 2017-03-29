var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    vinylpaths = require('vinyl-paths'),
    cleancss = require('gulp-clean-css'),
    cmq = require('gulp-combine-mq'),
    prettify = require('gulp-jsbeautifier'),
    concatcss = require('gulp-concat-css'),
    uglify = require('gulp-uglify'),
    foreach = require('gulp-flatmap'),
    changed = require('gulp-changed'),
    vinylpaths = require('vinyl-paths'),
    del = require('del');

// CSS
gulp.task('source:css', function(){
    return gulp.src('assets/scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer('> 0%'))
        .pipe(cmq())
        .pipe(prettify())
        .pipe(gulp.dest('temp/css'))
        .pipe(rename('widget.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(notify({ message: 'Source styles task complete' }));
} );

// Vendor JS
gulp.task('vendor:js', function(){
    return gulp.src([
        'assets/vendor/*.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.js'
    ])
    .pipe(foreach(function(stream, file){
        return stream
            .pipe(changed('temp/js'))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('temp/js'))
    }))
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Clean temp folder
gulp.task('clean:temp', function(){
    return gulp.src('temp/*')
    .pipe(vinylpaths(del))
});

// Default task
gulp.task('default', ['clean:temp'], function() {
    gulp.start('source:css', 'watch');
    gulp.start('vendor:js', 'watch');
});

// Watch
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch(['assets/scss/*.scss', 'assets/sass/**/*.scss'], ['source:css']);
    gulp.watch(['assets/js/vendor/*.js'], ['vendor:js']);
});
