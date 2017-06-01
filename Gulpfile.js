var gulp = require('gulp');
var concat = require('gulp-concat');

var sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps')
	postcss      = require('gulp-postcss');
	
var minifyJS = require('gulp-minify');

var uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish');

var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect-php');

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var browserSync = require('browser-sync').create();

var src  = "./src/";
var dist = "./dist/";

gulp.task('connect', function() {
  connect.server({
    port: 3002,
  }, function(){
  		browserSync.init({
			proxy: '127.0.0.1:3002',
			open: false,
			ghostMode: false
		});
  });
});

gulp.task('styles', function() {
    gulp.src( src + 'sass/**/*.scss')
    	.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
        	autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'ChromeAndroid >= 2.3'] }),
        	cssnano()
        ]))
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

gulp.task('images', function () {
     return gulp.src([
     		src + 'images/**/*',
     		src + 'img/**/*',
     		src + 'imgs/**/*'
     	 ])
         .pipe(imagemin({
             progressive: true,
             svgoPlugins: [{removeViewBox: false}]
         }))
         .pipe(gulp.dest(dist + 'images/'));
});

//Watch task
gulp.task('default', ['styles', 'javascript', 'connect'], function() {
	
    gulp.watch( src + 'sass/**/*.scss',['styles']);
    gulp.watch( src + 'js/**/*.js',['javascript']);
    
    gulp.watch( dist + 'css/*.css', function(){
	    gulp.src(dist + 'css/*.css')
	   		.pipe(browserSync.stream());
   }); 
   
    gulp.watch( src + '../**/*.php').on('change', browserSync.reload);
    gulp.watch( src + '../**/*.html').on('change', browserSync.reload);
    
	gulp.watch( src + 'js/**/*.js').on('change', browserSync.reload);
});

gulp.task('compress', function(){
	gulp.start('images');
});