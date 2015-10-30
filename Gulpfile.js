var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass'),
	minifyCSS = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer');
var minifyJS = require('gulp-minify');
var uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect-php');

var src  = "./src/";
var dist = "./dist/";

gulp.task('connect', function() {
  connect.server({
    port: 3000
  });
});

gulp.task('styles', function() {
    gulp.src( src + 'sass/**/*.scss')
    	.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( dist + 'css/'));
});

gulp.task('javascript', function() {
  	gulp.src([ src + 'js/**/*.js'])
  		.pipe(jshint())
  		.pipe(jshint.reporter(stylish))
  		//.pipe(jshint.reporter('fail'))
  		.pipe(sourcemaps.init())
  		.pipe(concat('main.js'))
  		.pipe(uglify())
  		.pipe(sourcemaps.write('./'))
  		.pipe(gulp.dest( dist + 'js/'));
});

// gulp.task('images', function () {
//     return gulp.src( src + 'images/**/*')
//         .pipe(imagemin({
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}]
//         }))
//         .pipe(gulp.dest(dist + 'images/'));
// });

//Watch task
gulp.task('default',function() {
    gulp.watch( src + 'sass/**/*.scss',['styles']);
    gulp.watch( src + 'js/**/*.js',['javascript']);
    gulp.watch( src + 'images/**/*',['images']);
    
    gulp.start('styles', 'javascript', 'connect');
});